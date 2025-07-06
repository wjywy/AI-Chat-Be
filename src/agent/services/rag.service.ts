import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { PromptTemplate } from '@langchain/core/prompts';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import {
  KNOWLEDGE_DOCUMENTS,
  KnowledgeDocument,
} from '../knowledge-base/documents';
import {
  RagQueryDto,
  RagResponseDto,
  AddDocumentDto,
  ProcessPdfDto,
  PdfProcessResponseDto,
} from '../dto/rag.dto';
import { Runnable } from '@langchain/core/runnables';

interface DocumentWithMetadata extends Document {
  metadata: {
    id?: string;
    title?: string;
    category?: string;
    score?: number;
    source?: string;
    pageNumber?: number;
    fileName?: string;
    chunkIndex?: number;
  };
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private vectorStore: MemoryVectorStore;
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  private qaChain: Runnable;
  private textSplitter: RecursiveCharacterTextSplitter;
  private documents: KnowledgeDocument[] = [...KNOWLEDGE_DOCUMENTS];

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      // 初始化嵌入模型
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: 'sk-839c413f949049918615290813173f2f',
        configuration: {
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        },
        modelName: 'text-embedding-v1',
      });

      // 初始化LLM
      this.llm = new ChatOpenAI({
        openAIApiKey: 'sk-839c413f949049918615290813173f2f',
        configuration: {
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        },
        modelName: 'qwen-long',
        temperature: 0.1,
      });

      // 初始化文本分割器
      this.textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      // 初始化向量存储
      await this.initializeVectorStore();

      // 初始化QA链
      this.initializeQAChain();

      this.logger.log('RAG服务初始化完成');
    } catch (error) {
      this.logger.error('RAG服务初始化失败:', error);
      throw error;
    }
  }

  private async initializeVectorStore() {
    const docs = await this.prepareDocuments(this.documents);
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      this.embeddings,
    );
  }

  private async prepareDocuments(
    knowledgeDocs: KnowledgeDocument[],
  ): Promise<Document[]> {
    const documents: Document[] = [];

    for (const doc of knowledgeDocs) {
      const chunks = await this.textSplitter.splitText(doc.content);

      for (let i = 0; i < chunks.length; i++) {
        documents.push(
          new Document({
            pageContent: chunks[i],
            metadata: {
              id: doc.id,
              title: doc.title,
              category: doc.category,
              chunkIndex: i,
              ...doc.metadata,
            },
          }),
        );
      }
    }

    return documents;
  }

  private async initializeQAChain() {
    const prompt = PromptTemplate.fromTemplate(`
    你是一个专业的AI助手，请基于以下上下文信息回答用户的问题。

    上下文信息：
    {context}

    用户问题：{input}

    请根据上下文信息提供准确、详细的回答。如果上下文中没有相关信息，请明确说明。
    回答要求：
    1. 基于提供的上下文信息
    2. 准确、客观、有用
    3. 如果信息不足，请说明
    4. 使用中文回答

    回答：`);

    // 创建文档链
    const combineDocsChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt,
    });

    this.qaChain = await createRetrievalChain({
      retriever: this.vectorStore.asRetriever(),
      combineDocsChain,
    });
  }

  async query(queryDto: RagQueryDto): Promise<RagResponseDto> {
    try {
      const { query, k = 3, categories, scoreThreshold = 0.5 } = queryDto;

      // 执行相似性搜索
      let retriever = this.vectorStore.asRetriever({ k });

      // 如果指定了类别，添加过滤器
      if (categories && categories.length > 0) {
        retriever = this.vectorStore.asRetriever({
          k,
          filter: (doc) => categories.includes(doc.metadata.category),
        });
      }

      // 获取相关文档
      const relevantDocs = await retriever.invoke(query);

      // 过滤低分文档（如果有评分的话）
      const filteredDocs = relevantDocs.filter((doc: DocumentWithMetadata) => {
        return !doc.metadata.score || doc.metadata.score >= scoreThreshold;
      });

      if (filteredDocs.length === 0) {
        return {
          answer:
            '抱歉，我在知识库中没有找到与您问题相关的信息。请尝试使用不同的关键词或更具体的问题。',
          sources: [],
          query,
          timestamp: new Date(),
        };
      }

      // 使用QA链生成回答
      const result = (await this.qaChain.invoke({
        input: query, // 改为 input 而不是 query
      })) as Record<string, string>;

      // 处理源文档
      const sources = filteredDocs.map(
        (doc: DocumentWithMetadata, index: number) => ({
          id: doc.metadata.id || `doc_${index}`,
          title: doc.metadata.title || '未知标题',
          category: doc.metadata.category || '未分类',
          score: doc.metadata.score || 1.0,
          content: doc.pageContent.substring(0, 200) + '...',
        }),
      );

      return {
        answer: result.text || result.answer || '无法生成回答',
        sources,
        query,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('RAG查询失败:', error);
      throw new Error(`RAG查询失败: ${error}`);
    }
  }

  async similaritySearch(query: string, k: number = 5): Promise<any[]> {
    try {
      const results = await this.vectorStore.similaritySearch(query, k);
      return results.map((doc: DocumentWithMetadata, index: number) => ({
        id: doc.metadata.id || `doc_${index}`,
        title: doc.metadata.title || '未知标题',
        category: doc.metadata.category || '未分类',
        content: doc.pageContent,
        metadata: doc.metadata,
      }));
    } catch (error) {
      this.logger.error('相似性搜索失败:', error);
      throw new Error(`相似性搜索失败: ${error}`);
    }
  }

  async addDocument(
    addDocumentDto: AddDocumentDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const newDoc: KnowledgeDocument = {
        id: Date.now().toString(),
        title: addDocumentDto.title,
        content: addDocumentDto.content,
        category: addDocumentDto.category,
        metadata: addDocumentDto.metadata,
      };

      // 添加到文档列表
      this.documents.push(newDoc);

      // 准备新文档
      const docs = await this.prepareDocuments([newDoc]);

      // 添加到向量存储
      await this.vectorStore.addDocuments(docs);

      return {
        success: true,
        message: '文档添加成功',
      };
    } catch (error) {
      this.logger.error('添加文档失败:', error);
      throw new Error(`添加文档失败: ${error}`);
    }
  }

  getDocuments(): KnowledgeDocument[] {
    return this.documents;
  }

  /**
   * 获取所有文档的分类列表
   * @returns 去重后的分类字符串数组
   */
  getCategories(): string[] {
    return [...new Set(this.documents.map((doc) => doc.category))];
  }

  /**
   * 处理PDF文件进行RAG
   * @param processPdfDto PDF处理参数
   * @returns 处理结果
   */
  async processPdfFile(
    processPdfDto: ProcessPdfDto,
  ): Promise<PdfProcessResponseDto> {
    try {
      const {
        filePath,
        title,
        category = 'PDF文档',
        metadata = {},
      } = processPdfDto;

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        throw new Error(`PDF文件不存在: ${filePath}`);
      }

      // 读取PDF文件
      const pdfBuffer = fs.readFileSync(filePath);

      // 提取PDF文本
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('PDF文件中没有提取到文本内容');
      }

      // 生成文档ID和标题
      const documentId = `pdf_${Date.now()}`;
      const documentTitle = title || path.basename(filePath, '.pdf');

      // 创建知识文档
      const knowledgeDoc: KnowledgeDocument = {
        id: documentId,
        title: documentTitle,
        content: extractedText,
        category,
        metadata: {
          ...metadata,
          source: filePath,
          fileName: path.basename(filePath),
          fileSize: pdfBuffer.length,
          pageCount: pdfData.numpages,
          processedAt: new Date().toISOString(),
        },
      };

      // 添加到文档列表
      this.documents.push(knowledgeDoc);

      // 文本分割
      const chunks = await this.textSplitter.splitText(extractedText);
      const documents: Document[] = [];

      // 创建文档块
      for (let i = 0; i < chunks.length; i++) {
        documents.push(
          new Document({
            pageContent: chunks[i],
            metadata: {
              id: documentId,
              title: documentTitle,
              category,
              chunkIndex: i,
              source: filePath,
              fileName: path.basename(filePath),
              ...metadata,
            },
          }),
        );
      }

      // 添加到向量存储
      await this.vectorStore.addDocuments(documents);

      this.logger.log(
        `PDF文件处理完成: ${filePath}, 生成 ${chunks.length} 个文本块`,
      );

      return {
        success: true,
        message: 'PDF文件处理成功',
        documentId,
        chunksCount: chunks.length,
        extractedText: extractedText.substring(0, 500) + '...', // 返回前500字符作为预览
      };
    } catch (error) {
      this.logger.error('PDF文件处理失败:', error);
      return {
        success: false,
        message: `PDF文件处理失败: ${error}`,
      };
    }
  }

  /**
   * 批量处理PDF文件
   * @param pdfFiles PDF文件路径数组
   * @param category 文档分类
   * @returns 批量处理结果
   */
  async processPdfFiles(
    pdfFiles: string[],
    category: string = 'PDF文档',
  ): Promise<PdfProcessResponseDto[]> {
    const results: PdfProcessResponseDto[] = [];

    for (const filePath of pdfFiles) {
      const result = await this.processPdfFile({
        filePath,
        category,
        title: path.basename(filePath, '.pdf'),
      });
      results.push(result);
    }

    return results;
  }

  /**
   * 从PDF文件中搜索相关内容
   * @param query 查询内容
   * @param pdfSource 指定PDF来源（可选）
   * @param k 返回结果数量
   * @returns 搜索结果
   */
  async searchInPdf(
    query: string,
    pdfSource?: string,
    k: number = 5,
  ): Promise<any[]> {
    try {
      let retriever = this.vectorStore.asRetriever({ k });

      // 如果指定了PDF来源，添加过滤器
      if (pdfSource) {
        retriever = this.vectorStore.asRetriever({
          k,
          filter: (doc) => doc.metadata.source === pdfSource,
        });
      }

      const results = await retriever.invoke(query);

      return results.map((doc: DocumentWithMetadata, index: number) => ({
        id: doc.metadata.id || `doc_${index}`,
        title: doc.metadata.title || '未知标题',
        category: doc.metadata.category || '未分类',
        content: doc.pageContent,
        source: doc.metadata.source,
        fileName: doc.metadata.fileName,
        chunkIndex: doc.metadata.chunkIndex,
        metadata: doc.metadata,
      }));
    } catch (error) {
      this.logger.error('PDF搜索失败:', error);
      throw new Error(`PDF搜索失败: ${error}`);
    }
  }

  /**
   * 获取已处理的PDF文档列表
   * @returns PDF文档列表
   */
  getPdfDocuments(): KnowledgeDocument[] {
    return this.documents.filter(
      (doc) =>
        doc.metadata?.fileName &&
        typeof doc.metadata.fileName === 'string' &&
        doc.metadata.fileName.endsWith('.pdf'),
    );
  }

  async searchTechPdf() {
    // 处理单个PDF文件
    const result = await this.processPdfFile({
      filePath: 'C:\\Users\\29346\\Desktop\\2021212400-吴家余-教学档案.pdf',
      title: '吴家余教学档案',
      category: '教学文档',
      metadata: {
        author: '吴家余',
        year: '2021',
        type: '教学档案',
      },
    });

    console.log(result, 'result');

    // 在PDF中搜索内容
    const searchResults = await this.searchInPdf(
      '教学计划',
      'C:\\Users\\29346\\Desktop\\2021212400-吴家余-教学档案.pdf',
      5,
    );

    console.log(searchResults, 'searchResults');

    // 使用RAG进行问答
    const answer = await this.query({
      query: '教学档案中包含哪些内容？',
      k: 3,
      categories: ['教学文档'],
    });

    return answer;
  }
}
