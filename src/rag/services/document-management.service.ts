import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import { RagDocument, RagChunk } from '../entities';
import { VectorRetrievalService } from './vector-retrieval.service';
import { AddDocumentDto, DocumentProcessResponseDto } from '../dto';

@Injectable()
export class DocumentManagementService {
  private readonly logger = new Logger(DocumentManagementService.name);
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor(
    private readonly configService: ConfigService,
    private readonly vectorRetrievalService: VectorRetrievalService,
    @InjectRepository(RagDocument)
    private readonly documentRepository: Repository<RagDocument>,
    @InjectRepository(RagChunk)
    private readonly chunkRepository: Repository<RagChunk>,
  ) {
    this.initializeTextSplitter();
  }

  private initializeTextSplitter() {
    const ragConfig = this.configService.get('rag');
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: ragConfig.document.chunkSize,
      chunkOverlap: ragConfig.document.chunkOverlap,
      separators: ['\n\n', '\n', '. ', ' ', ''],
    });
  }

  async addDocument(
    documentDto: AddDocumentDto,
  ): Promise<DocumentProcessResponseDto> {
    try {
      const startTime = Date.now();

      // 验证文档大小
      const maxSize = this.configService.get('rag.document.maxDocumentSize');
      if (documentDto.content.length > maxSize) {
        throw new Error(
          `Document size exceeds maximum limit of ${maxSize} bytes`,
        );
      }

      // 创建文档记录
      const document = this.documentRepository.create({
        title: documentDto.title,
        url: documentDto.url,
        content: documentDto.content,
        metadata: documentDto.metadata || {},
      });

      const savedDocument = await this.documentRepository.save(document);
      this.logger.log(`Document saved with ID: ${savedDocument.id}`);

      // 分块处理
      const chunks = await this.processDocumentChunks(
        savedDocument,
        documentDto.content,
        null,
      );

      // 向量化并存储到向量数据库
      await this.vectorizeChunks(chunks);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        message: 'Document processed successfully',
        documentId: savedDocument.id,
        chunksCount: chunks.length,
        processingTime: processingTime,
      };
    } catch (error) {
      this.logger.error('Document processing failed', error);
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }

  private async processDocumentChunks(
    document: RagDocument,
    content: string,
    section?: string,
  ): Promise<RagChunk[]> {
    try {
      // 使用文本分割器分块
      const textChunks = await this.textSplitter.splitText(content);

      const chunks: RagChunk[] = [];

      for (let i = 0; i < textChunks.length; i++) {
        const chunkContent = textChunks[i];

        const chunk = this.chunkRepository.create({
          document_id: document.id,
          content: chunkContent,
          section: section || null,
          chunk_index: i,
          metadata: {
            document_title: document.title,
            document_url: document.url,
            chunk_length: chunkContent.length,
            created_at: new Date(),
          },
        });

        chunks.push(chunk);
      }

      // 批量保存chunks
      const savedChunks = await this.chunkRepository.save(chunks);
      this.logger.log(
        `Created ${savedChunks.length} chunks for document ${document.id}`,
      );

      return savedChunks;
    } catch (error) {
      this.logger.error('Chunk processing failed', error);
      throw error;
    }
  }

  private async vectorizeChunks(chunks: RagChunk[]): Promise<void> {
    try {
      // 转换为LangChain Document格式
      const documents: Document[] = chunks.map(
        (chunk) =>
          new Document({
            pageContent: chunk.content,
            metadata: {
              chunkId: chunk.id,
              documentId: chunk.document_id,
              section: chunk.section,
              chunkIndex: chunk.chunk_index,
              ...chunk.metadata,
            },
          }),
      );

      // 添加到向量数据库
      await this.vectorRetrievalService.addDocuments(documents);

      this.logger.log(`Vectorized ${documents.length} chunks`);
    } catch (error) {
      this.logger.error('Vectorization failed', error);
      throw error;
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      // 获取文档的所有chunks
      const chunks = await this.chunkRepository.find({
        where: { document_id: documentId },
      });

      if (chunks.length > 0) {
        // 从向量数据库删除
        const chunkIds = chunks.map((chunk) => chunk.id);
        await this.vectorRetrievalService.deleteDocuments(chunkIds);

        // 从关系数据库删除chunks
        await this.chunkRepository.delete({ document_id: documentId });
      }

      // 删除文档记录
      await this.documentRepository.delete(documentId);

      this.logger.log(
        `Document ${documentId} and ${chunks.length} chunks deleted`,
      );
    } catch (error) {
      this.logger.error('Document deletion failed', error);
      throw new Error(`Document deletion failed: ${error.message}`);
    }
  }

  async getDocument(documentId: string): Promise<RagDocument> {
    try {
      const document = await this.documentRepository.findOne({
        where: { id: documentId },
        relations: ['chunks'],
      });

      if (!document) {
        throw new Error(`Document with ID ${documentId} not found`);
      }

      return document;
    } catch (error) {
      this.logger.error('Failed to get document', error);
      throw error;
    }
  }

  async listDocuments(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    documents: RagDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const [documents, total] = await this.documentRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
      });

      return {
        documents,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to list documents', error);
      throw error;
    }
  }

  async updateDocument(
    documentId: string,
    updateData: Partial<AddDocumentDto>,
  ): Promise<DocumentProcessResponseDto> {
    try {
      const startTime = Date.now();
      const document = await this.getDocument(documentId);

      // 如果内容发生变化，需要重新处理
      if (updateData.content && updateData.content !== document.content) {
        // 删除旧的chunks和向量
        await this.deleteDocumentChunks(documentId);

        // 更新文档内容
        await this.documentRepository.update(documentId, {
          title: updateData.title || document.title,
          url: updateData.url || document.url,
          content: updateData.content,
          metadata: { ...document.metadata, ...updateData.metadata },
        });

        // 重新处理文档
        const updatedDocument = await this.getDocument(documentId);
        const chunks = await this.processDocumentChunks(
          updatedDocument,
          updateData.content,
          null,
        );

        await this.vectorizeChunks(chunks);
        const processingTime = Date.now() - startTime;

        return {
          success: true,
          message: 'Document updated successfully',
          documentId: documentId,
          chunksCount: chunks.length,
          processingTime: processingTime,
        };
      } else {
        // 只更新元数据
        await this.documentRepository.update(documentId, {
          title: updateData.title || document.title,
          url: updateData.url || document.url,
          metadata: { ...document.metadata, ...updateData.metadata },
        });
        const processingTime = Date.now() - startTime;

        return {
          success: true,
          message: 'Document metadata updated successfully',
          documentId: documentId,
          chunksCount: 0,
          processingTime: processingTime,
        };
      }
    } catch (error) {
      this.logger.error('Document update failed', error);
      throw new Error(`Document update failed: ${error.message}`);
    }
  }

  private async deleteDocumentChunks(documentId: string): Promise<void> {
    const chunks = await this.chunkRepository.find({
      where: { document_id: documentId },
    });

    if (chunks.length > 0) {
      const chunkIds = chunks.map((chunk) => chunk.id);
      await this.vectorRetrievalService.deleteDocuments(chunkIds);
      await this.chunkRepository.delete({ document_id: documentId });
    }
  }

  async getDocumentStats(): Promise<any> {
    try {
      const totalDocuments = await this.documentRepository.count();
      const totalChunks = await this.chunkRepository.count();

      const sectionStats = await this.chunkRepository
        .createQueryBuilder('chunk')
        .select('chunk.section', 'section')
        .addSelect('COUNT(*)', 'count')
        .groupBy('chunk.section')
        .getRawMany();

      return {
        total_documents: totalDocuments,
        total_chunks: totalChunks,
        section_distribution: sectionStats,
        vector_store_info:
          await this.vectorRetrievalService.getCollectionInfo(),
      };
    } catch (error) {
      this.logger.error('Failed to get document stats', error);
      throw error;
    }
  }
}
