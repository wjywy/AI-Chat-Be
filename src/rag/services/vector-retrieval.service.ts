import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { RagChunk } from '../entities';
import { SearchParams } from '../interfaces';

interface RetrievalResult {
  chunks: RagChunk[];
  documents: Document[];
  scores: number[];
}

@Injectable()
export class VectorRetrievalService {
  private readonly logger = new Logger(VectorRetrievalService.name);
  private vectorStore: Chroma;
  private embeddings: OpenAIEmbeddings;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RagChunk)
    private readonly chunkRepository: Repository<RagChunk>,
  ) {
    this.initializeVectorStore();
  }

  private async initializeVectorStore() {
    try {
      const ragConfig = this.configService.get('rag');

      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: ragConfig.langchain.openaiApiKey,
      });

      this.vectorStore = new Chroma(this.embeddings, {
        url: ragConfig.vectorDb.chromaUrl,
        collectionName: ragConfig.vectorDb.collectionName,
      });

      this.logger.log('Vector store initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize vector store', error);
      throw error;
    }
  }

  async addDocuments(documents: Document[]): Promise<void> {
    try {
      await this.vectorStore.addDocuments(documents);
      this.logger.log(`Added ${documents.length} documents to vector store`);
    } catch (error) {
      this.logger.error('Failed to add documents to vector store', error);
      throw error;
    }
  }

  async similaritySearch(
    query: string,
    searchParams?: SearchParams,
  ): Promise<RetrievalResult> {
    try {
      const ragConfig = this.configService.get('rag');
      const topK = searchParams?.topK || ragConfig.retrieval.topK;

      // 执行向量相似性搜索
      const results = await this.vectorStore.similaritySearchWithScore(
        query,
        topK,
      );

      // 提取文档ID和分数
      const documentIds: string[] = [];
      const scores: number[] = [];
      const documents: Document[] = [];

      results.forEach(([doc, score]) => {
        const chunkId = doc.metadata?.chunkId;
        if (chunkId) {
          documentIds.push(chunkId);
          scores.push(score);
          documents.push(doc);
        }
      });

      // 从数据库获取对应的chunk信息
      let chunks: RagChunk[] = [];
      if (documentIds.length > 0) {
        const queryBuilder = this.chunkRepository
          .createQueryBuilder('chunk')
          .leftJoinAndSelect('chunk.document', 'document')
          .whereInIds(documentIds);

        // 如果指定了section过滤
        if (searchParams?.section) {
          queryBuilder.andWhere('chunk.section = :section', {
            section: searchParams.section,
          });
        }

        chunks = await queryBuilder.getMany();

        // 按照相似度分数排序
        chunks.sort((a, b) => {
          const aIndex = documentIds.indexOf(a.id);
          const bIndex = documentIds.indexOf(b.id);
          return aIndex - bIndex;
        });
      }

      this.logger.log(
        `Retrieved ${chunks.length} chunks for query: ${query.substring(0, 50)}...`,
      );

      return {
        chunks,
        documents,
        scores,
      };
    } catch (error) {
      this.logger.error('Similarity search failed', error);
      throw new Error(`Similarity search failed: ${error.message}`);
    }
  }

  async hybridSearch(
    query: string,
    searchParams?: SearchParams,
  ): Promise<RetrievalResult> {
    try {
      // 首先执行向量搜索
      const vectorResults = await this.similaritySearch(query, searchParams);

      // 执行关键词搜索作为补充
      const keywordResults = await this.keywordSearch(query, searchParams);

      // 合并和去重结果
      const combinedChunks = this.mergeResults(
        vectorResults.chunks,
        keywordResults,
      );

      const ragConfig = this.configService.get('rag');
      const topK = searchParams?.topK || ragConfig.retrieval.topK;

      return {
        chunks: combinedChunks.slice(0, topK),
        documents: vectorResults.documents,
        scores: vectorResults.scores,
      };
    } catch (error) {
      this.logger.error('Hybrid search failed', error);
      throw new Error(`Hybrid search failed: ${error.message}`);
    }
  }

  private async keywordSearch(
    query: string,
    searchParams?: SearchParams,
  ): Promise<RagChunk[]> {
    try {
      const queryBuilder = this.chunkRepository
        .createQueryBuilder('chunk')
        .leftJoinAndSelect('chunk.document', 'document')
        .where(
          'MATCH(chunk.content) AGAINST(:query IN NATURAL LANGUAGE MODE)',
          {
            query,
          },
        );

      if (searchParams?.section) {
        queryBuilder.andWhere('chunk.section = :section', {
          section: searchParams.section,
        });
      }

      const ragConfig = this.configService.get('rag');
      const topK = searchParams?.topK || ragConfig.retrieval.topK;

      return await queryBuilder.limit(topK).getMany();
    } catch (error) {
      this.logger.warn('Keyword search failed, skipping', error);
      return [];
    }
  }

  private mergeResults(
    vectorChunks: RagChunk[],
    keywordChunks: RagChunk[],
  ): RagChunk[] {
    const chunkMap = new Map<string, RagChunk>();

    // 添加向量搜索结果（优先级更高）
    vectorChunks.forEach((chunk) => {
      chunkMap.set(chunk.id, chunk);
    });

    // 添加关键词搜索结果
    keywordChunks.forEach((chunk) => {
      if (!chunkMap.has(chunk.id)) {
        chunkMap.set(chunk.id, chunk);
      }
    });

    return Array.from(chunkMap.values());
  }

  async deleteDocuments(documentIds: string[]): Promise<void> {
    try {
      // 注意：Chroma可能需要特定的删除方法
      // 这里需要根据实际的Chroma API进行调整
      await this.vectorStore.delete({ ids: documentIds });
      this.logger.log(
        `Deleted ${documentIds.length} documents from vector store`,
      );
    } catch (error) {
      this.logger.error('Failed to delete documents from vector store', error);
      throw error;
    }
  }

  async getCollectionInfo(): Promise<any> {
    try {
      // 获取集合信息
      // 这里需要根据实际的Chroma API进行调整
      return {
        name: this.configService.get('rag.vectorDb.collectionName'),
        url: this.configService.get('rag.vectorDb.chromaUrl'),
        status: 'connected',
      };
    } catch (error) {
      this.logger.error('Failed to get collection info', error);
      throw error;
    }
  }
}
