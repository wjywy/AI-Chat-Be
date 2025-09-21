import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryAnalysisService } from './query-analysis.service';
import { VectorRetrievalService } from './vector-retrieval.service';
import { AnswerGenerationService } from './answer-generation.service';
import { DocumentManagementService } from './document-management.service';
import { RagQuery, RagQueryResult } from '../entities';
import { RagQueryRequest, RagQueryResponse } from '../interfaces';
import { QueryAnalysisDto } from '../dto';
// import { QueryAnalysisResult } from '../interfaces/rag.interface';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly queryAnalysisService: QueryAnalysisService,
    private readonly vectorRetrievalService: VectorRetrievalService,
    private readonly answerGenerationService: AnswerGenerationService,
    private readonly documentManagementService: DocumentManagementService,
    @InjectRepository(RagQuery)
    private readonly queryRepository: Repository<RagQuery>,
    @InjectRepository(RagQueryResult)
    private readonly queryResultRepository: Repository<RagQueryResult>,
  ) {}

  async processQuery(request: RagQueryRequest): Promise<RagQueryResponse> {
    const startTime = Date.now();
    let queryRecord: RagQuery;

    try {
      this.logger.log(
        `Processing query: ${request.question.substring(0, 100)}...`,
      );

      // 1. 保存查询记录
      queryRecord = await this.saveQueryRecord(request);

      // 2. 查询分析
      const analysisResult = await this.queryAnalysisService.analyzeQuery({
        question: request.question,
      });

      // 3. 更新查询记录的分析结果
      await this.queryRepository.update(queryRecord.id, {
        analyzed_query: JSON.stringify({
          intent:
            (analysisResult.analysis.intent as
              | 'information_seeking'
              | 'comparison'
              | 'explanation'
              | 'how_to'
              | 'troubleshooting'
              | 'other') || 'information_seeking',
          complexity: 'medium',
          keywords: [],
          confidence: analysisResult.analysis.confidence || 0.8,
          rewritten_query: analysisResult.analysis.rewritten_query,
          entities: (analysisResult.analysis.entities || []).map((entity) =>
            typeof entity === 'string'
              ? { type: 'unknown', value: entity, confidence: 0.5 }
              : entity,
          ),
          topics: [],
          language: 'zh',
        }),
      });

      // 4. 向量检索
      const retrievalResult =
        await this.vectorRetrievalService.similaritySearch(
          analysisResult.analysis.rewritten_query || request.question,
          {
            query: analysisResult.analysis.rewritten_query || request.question,
            section: request.section,
            topK: request.top_k,
          },
        );

      // 5. 生成答案
      const response = await this.answerGenerationService.generateAnswer({
        query: request.question,
        chunks: retrievalResult.chunks,
        analysisResult: analysisResult.analysis,
      });

      // 6. 保存查询结果
      const processingTime = Date.now() - startTime;
      await this.saveQueryResult(queryRecord.id, response, processingTime);

      this.logger.log(
        `Query processed successfully in ${processingTime}ms, found ${retrievalResult.chunks.length} relevant chunks`,
      );

      return {
        ...response,
        metadata: {
          ...response.metadata,
          query_id: queryRecord.id,
          analysis_result: JSON.stringify({
            intent:
              (analysisResult.analysis.intent as
                | 'information_seeking'
                | 'comparison'
                | 'explanation'
                | 'how_to'
                | 'troubleshooting'
                | 'other') || 'information_seeking',
            complexity: 'medium',
            keywords: [],
            confidence: analysisResult.analysis.confidence || 0.8,
            rewritten_query: analysisResult.analysis.rewritten_query,
            entities:
              analysisResult.analysis.entities?.map((e) => ({
                type: 'entity',
                value: e,
                confidence: 0.8,
              })) || [],
            topics: [],
            language: 'zh',
          }),
        },
      };
    } catch (error) {
      this.logger.error('Query processing failed', error);

      // 记录错误结果
      if (queryRecord) {
        await this.saveQueryResult(
          queryRecord.id,
          {
            answer: `处理查询时发生错误: ${error.message}`,
            context_documents: [],
            metadata: { error: true, error_message: error.message },
            timestamp: new Date(),
          },
          Date.now() - startTime,
        );
      }

      throw new Error(`Query processing failed: ${error.message}`);
    }
  }

  async processQueryWithGraph(
    request: RagQueryRequest,
  ): Promise<RagQueryResponse> {
    const startTime = Date.now();
    let queryRecord: RagQuery;

    try {
      this.logger.log(
        `Processing query with graph workflow: ${request.question.substring(0, 100)}...`,
      );

      // 保存查询记录
      queryRecord = await this.saveQueryRecord(request);

      // 执行图工作流
      const result = await this.executeGraphWorkflow(request, queryRecord.id);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Graph workflow completed in ${processingTime}ms`);

      return result;
    } catch (error) {
      this.logger.error('Graph workflow failed', error);

      if (queryRecord) {
        await this.saveQueryResult(
          queryRecord.id,
          {
            answer: `图工作流处理时发生错误: ${error.message}`,
            context_documents: [],
            metadata: { error: true, error_message: error.message },
            timestamp: new Date(),
          },
          Date.now() - startTime,
        );
      }

      throw new Error(`Graph workflow failed: ${error.message}`);
    }
  }

  private async executeGraphWorkflow(
    request: RagQueryRequest,
    queryId: string,
  ): Promise<RagQueryResponse> {
    // 实现类似Python版本的图工作流
    const workflow = {
      // 节点1: 查询分析
      analyzeQuery: async () => {
        return await this.queryAnalysisService.analyzeQuery({
          question: request.question,
        } as QueryAnalysisDto);
      },

      // 节点2: 文档检索
      retrieveDocuments: async (analysisResult: any) => {
        const searchQuery =
          analysisResult.analysis.rewritten_query || request.question;

        // 根据查询复杂度选择检索策略
        if (analysisResult.analysis.complexity === 'complex') {
          return await this.vectorRetrievalService.hybridSearch(searchQuery, {
            query: searchQuery,
            section: request.section || analysisResult.analysis.section,
            topK: request.top_k,
          });
        } else {
          return await this.vectorRetrievalService.similaritySearch(
            searchQuery,
            {
              query: searchQuery,
              section: request.section || analysisResult.analysis.section,
              topK: request.top_k,
            },
          );
        }
      },

      // 节点3: 答案生成
      generateAnswer: async (retrievalResult: any, analysisResult: any) => {
        return await this.answerGenerationService.generateAnswer({
          query: request.question,
          chunks: retrievalResult.chunks,
          analysisResult: analysisResult.analysis,
        });
      },

      // 节点4: 质量评估
      evaluateQuality: async (answer: string, chunks: any[]) => {
        return await this.answerGenerationService.evaluateAnswerQuality(
          request.question,
          answer,
          chunks,
        );
      },
    };

    // 执行工作流
    const analysisResult = await workflow.analyzeQuery();

    // 更新查询记录
    await this.queryRepository.update(queryId, {
      analyzed_query: JSON.stringify({
        intent:
          (analysisResult.analysis.intent as
            | 'information_seeking'
            | 'comparison'
            | 'explanation'
            | 'how_to'
            | 'troubleshooting'
            | 'other') || 'information_seeking',
        complexity: 'medium',
        keywords: [],
        confidence: analysisResult.analysis.confidence || 0.8,
        rewritten_query: analysisResult.analysis.rewritten_query,
        entities: analysisResult.analysis.entities || [],
        topics: [],
        language: 'zh',
      }),
    });

    const retrievalResult = await workflow.retrieveDocuments(analysisResult);
    const response = await workflow.generateAnswer(
      retrievalResult,
      analysisResult,
    );
    const qualityScore = await workflow.evaluateQuality(
      response.answer,
      retrievalResult.chunks,
    );

    // 保存结果
    await this.saveQueryResult(
      queryId,
      {
        ...response,
        metadata: {
          ...response.metadata,
          quality_score: qualityScore,
          workflow_type: 'graph',
          analysis_result: JSON.stringify({
            intent:
              (analysisResult.analysis.intent as
                | 'information_seeking'
                | 'comparison'
                | 'explanation'
                | 'how_to'
                | 'troubleshooting'
                | 'other') || 'information_seeking',
            complexity: 'medium',
            keywords: [],
            confidence: analysisResult.analysis.confidence || 0.8,
            rewritten_query: analysisResult.analysis.rewritten_query,
            entities:
              analysisResult.analysis.entities?.map((e) => ({
                type: 'entity',
                value: e,
                confidence: 0.8,
              })) || [],
            topics: [],
            language: 'zh',
          }),
        },
      },
      response.metadata.processing_time,
    );

    return {
      ...response,
      metadata: {
        ...response.metadata,
        query_id: queryId,
        quality_score: qualityScore,
        workflow_type: 'graph',
      },
    };
  }

  private async saveQueryRecord(request: RagQueryRequest): Promise<RagQuery> {
    const query = this.queryRepository.create({
      user_id: request.user_id,
      question: request.question,
      model: request.model,
    });

    return await this.queryRepository.save(query);
  }

  private async saveQueryResult(
    queryId: string,
    response: RagQueryResponse,
    processingTime: number,
  ): Promise<void> {
    const result = this.queryResultRepository.create({
      query_id: queryId,
      answer: response.answer,
      context_documents: response.context_documents,
      metadata: response.metadata,
      processing_time: processingTime,
    });

    await this.queryResultRepository.save(result);
  }

  async getQueryHistory(
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    queries: RagQuery[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const queryBuilder = this.queryRepository
        .createQueryBuilder('query')
        .leftJoinAndSelect('query.results', 'results')
        .orderBy('query.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (userId) {
        queryBuilder.where('query.user_id = :userId', { userId });
      }

      const [queries, total] = await queryBuilder.getManyAndCount();

      return {
        queries,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to get query history', error);
      throw error;
    }
  }

  async getQueryById(queryId: string): Promise<RagQuery> {
    try {
      const query = await this.queryRepository.findOne({
        where: { id: queryId },
        relations: ['results'],
      });

      if (!query) {
        throw new Error(`Query with ID ${queryId} not found`);
      }

      return query;
    } catch (error) {
      this.logger.error('Failed to get query', error);
      throw error;
    }
  }

  async getSystemStats(): Promise<any> {
    try {
      const totalQueries = await this.queryRepository.count();
      const totalResults = await this.queryResultRepository.count();

      const avgProcessingTime = await this.queryResultRepository
        .createQueryBuilder('result')
        .select('AVG(result.processing_time)', 'avg_time')
        .getRawOne();

      const documentStats =
        await this.documentManagementService.getDocumentStats();

      return {
        total_queries: totalQueries,
        total_results: totalResults,
        avg_processing_time: parseFloat(avgProcessingTime.avg_time) || 0,
        ...documentStats,
      };
    } catch (error) {
      this.logger.error('Failed to get system stats', error);
      throw error;
    }
  }

  async healthCheck(): Promise<any> {
    try {
      // 检查各个服务的健康状态
      const vectorStoreInfo =
        await this.vectorRetrievalService.getCollectionInfo();
      const documentStats =
        await this.documentManagementService.getDocumentStats();

      return {
        status: 'healthy',
        timestamp: new Date(),
        services: {
          vector_store: vectorStoreInfo,
          document_management: {
            total_documents: documentStats.total_documents,
            total_chunks: documentStats.total_chunks,
          },
          query_analysis: { status: 'active' },
          answer_generation: { status: 'active' },
        },
      };
    } catch (error) {
      this.logger.error('Health check failed', error);
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        error: error.message,
      };
    }
  }
}
