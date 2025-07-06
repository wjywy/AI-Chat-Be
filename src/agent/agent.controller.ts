import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { GenerateContentDto } from './dto/create-agent.dto';
import { RagService } from './services/rag.service';
import { RagQueryDto, AddDocumentDto } from './dto/rag.dto';
import { AgentType } from './entities/agent.entity';
import { MbtiService } from './services/mbti.service';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly ragService: RagService,
    private readonly mbtiService: MbtiService,
  ) {}

  @Get('templates')
  getTemplates() {
    return {
      success: true,
      data: this.agentService.getAgentTemplates(),
    };
  }

  @Post('generate')
  async generateContent(@Body() generateContentDto: GenerateContentDto) {
    try {
      const result =
        await this.agentService.generateContent(generateContentDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error || '生成内容失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // RAG相关端点
  @Post('rag/query')
  async ragQuery(@Body() ragQueryDto: RagQueryDto) {
    try {
      const result = await this.ragService.query(ragQueryDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error || 'RAG查询失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('rag/test')
  async searchTechPdf() {
    const result = await this.ragService.searchTechPdf();
    return {
      success: true,
      data: result,
    };
  }

  @Post('rag/simple')
  async ragSimpleQuery(
    @Body() body: { query: string; options?: Record<string, any> },
  ) {
    try {
      const generateContentDto: GenerateContentDto = {
        agentType: 'rag' as AgentType.RAG,
        prompt: body.query,
        options: body.options,
      };
      const result =
        await this.agentService.generateContent(generateContentDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error || 'RAG查询失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rag/search')
  async ragSimilaritySearch(
    @Query('query') query: string,
    @Query('k') k: number = 5,
  ) {
    try {
      const results = await this.ragService.similaritySearch(query, k);
      return {
        success: true,
        data: results,
      };
    } catch (error) {
      throw new HttpException(
        error || '相似性搜索失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('rag/documents')
  async addDocument(@Body() addDocumentDto: AddDocumentDto) {
    try {
      const result = await this.ragService.addDocument(addDocumentDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error || '添加文档失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rag/documents')
  getDocuments() {
    return {
      success: true,
      data: this.ragService.getDocuments(),
    };
  }

  @Get('rag/categories')
  getCategories() {
    return {
      success: true,
      data: this.ragService.getCategories(),
    };
  }

  // MBTI相关端点
  @Post('mbti/chat')
  async mbtiChat(@Body() body: { input: string; sessionId?: string }) {
    try {
      const result = await this.mbtiService.chat(
        body.input,
        body.sessionId || 'default',
      );
      return {
        success: true,
        data: {
          content: result,
          sessionId: body.sessionId || 'default',
        },
      };
    } catch (error) {
      throw new HttpException(
        error || 'MBTI聊天失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('mbti/simple')
  async mbtiSimpleQuery(
    @Body()
    body: {
      query: string;
      sessionId?: string;
      options?: Record<string, any>;
    },
  ) {
    try {
      const generateContentDto: GenerateContentDto = {
        agentType: 'mbti' as AgentType.MBTI,
        prompt: body.query,
        options: {
          sessionId: body.sessionId || 'default',
          ...body.options,
        },
      };
      const result =
        await this.agentService.generateContent(generateContentDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error || 'MBTI查询失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
