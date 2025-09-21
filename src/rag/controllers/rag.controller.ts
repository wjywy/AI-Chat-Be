import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { RagService } from '../services/rag.service';
import { DocumentManagementService } from '../services/document-management.service';
import {
  QueryAnalysisDto,
  QueryAnalysisResponseDto,
  AddDocumentDto,
  DocumentProcessResponseDto,
} from '../dto';
import { RagQueryRequest, RagQueryResponse } from '../interfaces';

@ApiTags('RAG')
@Controller('rag')
export class RagController {
  private readonly logger = new Logger(RagController.name);

  constructor(
    private readonly ragService: RagService,
    private readonly documentManagementService: DocumentManagementService,
  ) {}

  @Post('query')
  @ApiOperation({ summary: '处理RAG查询' })
  @ApiResponse({
    status: 200,
    description: '查询处理成功',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
  })
  @ApiResponse({
    status: 500,
    description: '服务器内部错误',
  })
  async processQuery(
    @Body() request: RagQueryRequest,
  ): Promise<RagQueryResponse> {
    try {
      this.logger.log(
        `Received query request: ${request.question?.substring(0, 50)}...`,
      );

      if (!request.question || request.question.trim().length === 0) {
        throw new HttpException('Question is required', HttpStatus.BAD_REQUEST);
      }

      const response = await this.ragService.processQuery(request);
      return response;
    } catch (error) {
      this.logger.error('Query processing failed', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Query processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('query/graph')
  @ApiOperation({ summary: '使用图工作流处理RAG查询' })
  @ApiResponse({
    status: 200,
    description: '图工作流查询处理成功',
    type: Object,
  })
  async processQueryWithGraph(
    @Body() request: RagQueryRequest,
  ): Promise<RagQueryResponse> {
    try {
      this.logger.log(
        `Received graph query request: ${request.question?.substring(0, 50)}...`,
      );

      if (!request.question || request.question.trim().length === 0) {
        throw new HttpException('Question is required', HttpStatus.BAD_REQUEST);
      }

      const response = await this.ragService.processQueryWithGraph(request);
      return response;
    } catch (error) {
      this.logger.error('Graph query processing failed', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Graph query processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('analyze')
  @ApiOperation({ summary: '分析查询' })
  @ApiResponse({
    status: 200,
    description: '查询分析成功',
    type: QueryAnalysisResponseDto,
  })
  async analyzeQuery(
    @Body() dto: QueryAnalysisDto,
  ): Promise<QueryAnalysisResponseDto> {
    try {
      this.logger.log(`Analyzing query: ${dto.question?.substring(0, 50)}...`);

      if (!dto.question || dto.question.trim().length === 0) {
        throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
      }

      // 这里需要注入QueryAnalysisService
      // 暂时返回模拟数据，实际应该调用服务
      const response: QueryAnalysisResponseDto = {
        result: 'Query analysis completed successfully',
        analysis: {
          intent: 'information_seeking',
          rewritten_query: dto.question,
          confidence: 0.8,
        },
      };

      return response;
    } catch (error) {
      this.logger.error('Query analysis failed', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Query analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('documents')
  @ApiOperation({ summary: '添加文档' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        section: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '文档添加成功',
    type: DocumentProcessResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async addDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AddDocumentDto,
  ): Promise<DocumentProcessResponseDto> {
    try {
      this.logger.log(`Adding document: ${dto.title || file?.originalname}`);

      if (!file && !dto.content) {
        throw new HttpException(
          'Either file or content is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      let content = dto.content;
      if (file) {
        content = file.buffer.toString('utf-8');
      }

      const documentDto: AddDocumentDto = {
        ...dto,
        content,
      };

      const response =
        await this.documentManagementService.addDocument(documentDto);
      return response;
    } catch (error) {
      this.logger.error('Document addition failed', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Document addition failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('documents')
  @ApiOperation({ summary: '获取文档列表' })
  @ApiResponse({
    status: 200,
    description: '文档列表获取成功',
  })
  async getDocuments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('section') section?: string,
  ) {
    try {
      this.logger.log(
        `Getting documents: page=${page}, limit=${limit}, section=${section}`,
      );

      const response = await this.documentManagementService.listDocuments(
        page,
        limit,
      );
      return response;
    } catch (error) {
      this.logger.error('Failed to get documents', error);

      throw new HttpException(
        `Failed to get documents: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('documents/:id')
  @ApiOperation({ summary: '获取文档详情' })
  @ApiResponse({
    status: 200,
    description: '文档详情获取成功',
  })
  @ApiResponse({
    status: 404,
    description: '文档不存在',
  })
  async getDocument(@Param('id') id: string) {
    try {
      this.logger.log(`Getting document: ${id}`);

      const document = await this.documentManagementService.getDocument(id);
      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      return document;
    } catch (error) {
      this.logger.error('Failed to get document', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to get document: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: '删除文档' })
  @ApiResponse({
    status: 200,
    description: '文档删除成功',
  })
  @ApiResponse({
    status: 404,
    description: '文档不存在',
  })
  async deleteDocument(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting document: ${id}`);

      await this.documentManagementService.deleteDocument(id);

      return {
        message: 'Document deleted successfully',
        document_id: id,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to delete document', error);

      if (error.message.includes('not found')) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        `Failed to delete document: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('queries')
  @ApiOperation({ summary: '获取查询历史' })
  @ApiResponse({
    status: 200,
    description: '查询历史获取成功',
  })
  async getQueryHistory(
    @Query('user_id') userId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      this.logger.log(
        `Getting query history: userId=${userId}, page=${page}, limit=${limit}`,
      );

      const response = await this.ragService.getQueryHistory(
        userId,
        page,
        limit,
      );
      return response;
    } catch (error) {
      this.logger.error('Failed to get query history', error);

      throw new HttpException(
        `Failed to get query history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('queries/:id')
  @ApiOperation({ summary: '获取查询详情' })
  @ApiResponse({
    status: 200,
    description: '查询详情获取成功',
  })
  @ApiResponse({
    status: 404,
    description: '查询不存在',
  })
  async getQuery(@Param('id') id: string) {
    try {
      this.logger.log(`Getting query: ${id}`);

      const query = await this.ragService.getQueryById(id);
      return query;
    } catch (error) {
      this.logger.error('Failed to get query', error);

      if (error.message.includes('not found')) {
        throw new HttpException('Query not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        `Failed to get query: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: '获取系统统计信息' })
  @ApiResponse({
    status: 200,
    description: '统计信息获取成功',
  })
  async getStats() {
    try {
      this.logger.log('Getting system stats');

      const stats = await this.ragService.getSystemStats();
      return stats;
    } catch (error) {
      this.logger.error('Failed to get stats', error);

      throw new HttpException(
        `Failed to get stats: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({
    status: 200,
    description: '健康检查成功',
  })
  async healthCheck() {
    try {
      this.logger.log('Performing health check');

      const health = await this.ragService.healthCheck();
      return health;
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
