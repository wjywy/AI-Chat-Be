# NestJS查询分析RAG模块实现指南

## 1. 项目结构设计

在 `AI-Chat-Be/src` 目录下创建新的RAG模块：

```
src/
├── rag/
│   ├── rag.module.ts                 # RAG模块定义
│   ├── rag.controller.ts             # RAG控制器
│   ├── rag.service.ts                # RAG核心服务
│   ├── dto/
│   │   ├── query-analysis.dto.ts     # 查询分析DTO
│   │   ├── rag-query.dto.ts          # RAG查询DTO
│   │   ├── document-management.dto.ts # 文档管理DTO
│   │   └── index.ts                  # DTO导出文件
│   ├── entities/
│   │   ├── rag-document.entity.ts    # RAG文档实体
│   │   ├── rag-chunk.entity.ts       # RAG文档块实体
│   │   ├── rag-query.entity.ts       # RAG查询实体
│   │   └── rag-query-result.entity.ts # RAG查询结果实体
│   ├── services/
│   │   ├── query-analysis.service.ts  # 查询分析服务
│   │   ├── vector-retrieval.service.ts # 向量检索服务
│   │   ├── answer-generation.service.ts # 答案生成服务
│   │   ├── document-processing.service.ts # 文档处理服务
│   │   └── chroma-vector.service.ts   # Chroma向量数据库服务
│   ├── interfaces/
│   │   ├── rag-query.interface.ts     # RAG查询接口
│   │   ├── search-params.interface.ts # 搜索参数接口
│   │   └── rag-response.interface.ts  # RAG响应接口
│   ├── config/
│   │   ├── rag.config.ts             # RAG配置
│   │   └── models.config.ts          # 模型配置
│   └── utils/
│       ├── text-splitter.util.ts     # 文本分割工具
│       └── metadata-extractor.util.ts # 元数据提取工具
```

## 2. 核心服务实现

### 2.1 查询分析服务 (QueryAnalysisService)

```typescript
// src/rag/services/query-analysis.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { z } from 'zod';
import { SearchParams } from '../interfaces/search-params.interface';

// 定义查询分析的结构化输出模式
const SearchParamsSchema = z.object({
  query: z.string().describe('查询的关键词'),
  section: z.enum(['开头', '中间', '结尾']).describe('要查询的部分，必须是开头、中间、结尾之一')
});

@Injectable()
export class QueryAnalysisService {
  private readonly logger = new Logger(QueryAnalysisService.name);
  private llm: ChatOllama;

  constructor() {
    this.initializeLLM();
  }

  private initializeLLM() {
    this.llm = new ChatOllama({
      model: 'qwen2.5',
      temperature: 0,
      baseUrl: 'http://localhost:11434',
    });
  }

  async analyzeQuery(question: string): Promise<SearchParams> {
    try {
      const structuredLLM = this.llm.withStructuredOutput(SearchParamsSchema);
      
      const analysisPrompt = `
请分析以下用户问题，提取出查询关键词和文档分段信息：

用户问题：${question}

请根据问题内容推理出：
1. 查询关键词：提取问题中的核心关键词
2. 文档分段：根据问题内容判断应该在文档的哪个部分查找答案（开头/中间/结尾）

分析规则：
- 如果问题涉及介绍、概述、定义等，选择"开头"
- 如果问题涉及具体实现、过程、方法等，选择"中间"
- 如果问题涉及总结、优点、结论、展望等，选择"结尾"
`;

      const result = await structuredLLM.invoke(analysisPrompt);
      
      this.logger.log(`查询分析结果: ${JSON.stringify(result)}`);
      
      return result as SearchParams;
    } catch (error) {
      this.logger.error('查询分析失败:', error);
      // 返回默认分析结果
      return {
        query: question,
        section: '中间'
      };
    }
  }
}
```

### 2.2 向量检索服务 (VectorRetrievalService)

```typescript
// src/rag/services/vector-retrieval.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Document } from '@langchain/core/documents';
import { SearchParams } from '../interfaces/search-params.interface';

@Injectable()
export class VectorRetrievalService {
  private readonly logger = new Logger(VectorRetrievalService.name);
  private vectorStore: Chroma;
  private embeddings: OllamaEmbeddings;

  constructor() {
    this.initializeVectorStore();
  }

  private async initializeVectorStore() {
    try {
      this.embeddings = new OllamaEmbeddings({
        model: 'shaw/dmeta-embedding-zh',
        baseUrl: 'http://localhost:11434',
      });

      this.vectorStore = new Chroma(this.embeddings, {
        collectionName: 'rag_documents',
        url: 'http://localhost:8000', // Chroma服务地址
      });

      this.logger.log('向量存储初始化完成');
    } catch (error) {
      this.logger.error('向量存储初始化失败:', error);
      throw error;
    }
  }

  async retrieveDocuments(searchParams: SearchParams, k: number = 3): Promise<Document[]> {
    try {
      const { query, section } = searchParams;
      
      // 执行相似性搜索，带元数据过滤
      const results = await this.vectorStore.similaritySearch(
        query,
        k,
        {
          section: section
        }
      );

      this.logger.log(`检索到 ${results.length} 个相关文档`);
      
      return results;
    } catch (error) {
      this.logger.error('文档检索失败:', error);
      return [];
    }
  }

  async retrieveWithScore(searchParams: SearchParams, k: number = 3): Promise<Array<[Document, number]>> {
    try {
      const { query, section } = searchParams;
      
      const results = await this.vectorStore.similaritySearchWithScore(
        query,
        k,
        {
          section: section
        }
      );

      this.logger.log(`检索到 ${results.length} 个相关文档（带评分）`);
      
      return results;
    } catch (error) {
      this.logger.error('带评分文档检索失败:', error);
      return [];
    }
  }
}
```

### 2.3 答案生成服务 (AnswerGenerationService)

```typescript
// src/rag/services/answer-generation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';

@Injectable()
export class AnswerGenerationService {
  private readonly logger = new Logger(AnswerGenerationService.name);
  private llm: ChatOllama;
  private promptTemplate: ChatPromptTemplate;

  constructor() {
    this.initializeLLM();
    this.initializePrompt();
  }

  private initializeLLM() {
    this.llm = new ChatOllama({
      model: 'qwen2.5',
      temperature: 0.1,
      baseUrl: 'http://localhost:11434',
    });
  }

  private initializePrompt() {
    this.promptTemplate = ChatPromptTemplate.fromMessages([
      ['human', `你是问答任务的助手。
请使用以下检索到的**上下文**来回答问题。
如果你不知道答案，就说你不知道。最多使用三句话，并保持答案简洁。

问题: {question}

上下文: {context}

回答：`]
    ]);
  }

  async generateAnswer(question: string, context: Document[]): Promise<string> {
    try {
      if (context.length === 0) {
        return '抱歉，我在知识库中没有找到与您问题相关的信息。请尝试使用不同的关键词或更具体的问题。';
      }

      // 将文档内容合并为上下文字符串
      const contextContent = context
        .map(doc => doc.pageContent)
        .join('\n\n');

      // 生成提示词
      const messages = await this.promptTemplate.formatMessages({
        question,
        context: contextContent
      });

      // 调用LLM生成答案
      const response = await this.llm.invoke(messages);
      
      this.logger.log('答案生成完成');
      
      return response.content as string;
    } catch (error) {
      this.logger.error('答案生成失败:', error);
      return '抱歉，生成答案时出现错误，请稍后重试。';
    }
  }

  async generateAnswerWithModel(question: string, context: Document[], modelName: string): Promise<string> {
    try {
      // 创建指定模型的LLM实例
      const customLLM = new ChatOllama({
        model: modelName,
        temperature: 0.1,
        baseUrl: 'http://localhost:11434',
      });

      if (context.length === 0) {
        return '抱歉，我在知识库中没有找到与您问题相关的信息。';
      }

      const contextContent = context
        .map(doc => doc.pageContent)
        .join('\n\n');

      const messages = await this.promptTemplate.formatMessages({
        question,
        context: contextContent
      });

      const response = await customLLM.invoke(messages);
      
      this.logger.log(`使用模型 ${modelName} 生成答案完成`);
      
      return response.content as string;
    } catch (error) {
      this.logger.error(`使用模型 ${modelName} 生成答案失败:`, error);
      return '抱歉，生成答案时出现错误，请稍后重试。';
    }
  }
}
```

## 3. 主要DTO定义

### 3.1 查询分析DTO

```typescript
// src/rag/dto/query-analysis.dto.ts
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryAnalysisDto {
  @ApiProperty({ description: '用户的自然语言查询' })
  @IsString()
  question: string;

  @ApiProperty({ description: 'LLM模型名称', required: false, default: 'qwen2.5' })
  @IsOptional()
  @IsString()
  model?: string = 'qwen2.5';

  @ApiProperty({ description: '检索文档数量', required: false, default: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  k?: number = 3;

  @ApiProperty({ description: '相似度阈值', required: false, default: 0.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  scoreThreshold?: number = 0.5;
}

export class QueryAnalysisResponseDto {
  @ApiProperty({ description: '是否成功' })
  success: boolean;

  @ApiProperty({ description: '生成的答案' })
  answer: string;

  @ApiProperty({ description: '分析后的查询参数' })
  analyzedQuery: {
    query: string;
    section: string;
  };

  @ApiProperty({ description: '检索到的上下文文档' })
  context: Array<{
    content: string;
    metadata: Record<string, any>;
    score?: number;
  }>;

  @ApiProperty({ description: '查询元数据' })
  metadata: {
    processingTime: number;
    model: string;
    timestamp: string;
    documentsRetrieved: number;
  };
}
```

### 3.2 文档管理DTO

```typescript
// src/rag/dto/document-management.dto.ts
import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDocumentDto {
  @ApiProperty({ description: '文档标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '网页URL（与content二选一）', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ description: '文档内容（与url二选一）', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '文档元数据', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class DocumentProcessResponseDto {
  @ApiProperty({ description: '是否成功' })
  success: boolean;

  @ApiProperty({ description: '处理消息' })
  message: string;

  @ApiProperty({ description: '文档ID' })
  documentId: string;

  @ApiProperty({ description: '分块数量' })
  chunksCount: number;

  @ApiProperty({ description: '处理时间（毫秒）' })
  processingTime: number;
}
```

## 4. 控制器实现

```typescript
// src/rag/rag.controller.ts
import { Controller, Post, Get, Body, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RagService } from './rag.service';
import { QueryAnalysisDto, QueryAnalysisResponseDto } from './dto/query-analysis.dto';
import { AddDocumentDto, DocumentProcessResponseDto } from './dto/document-management.dto';

@ApiTags('RAG查询分析')
@Controller('rag')
export class RagController {
  private readonly logger = new Logger(RagController.name);

  constructor(private readonly ragService: RagService) {}

  @Post('query')
  @ApiOperation({ summary: '执行查询分析RAG查询' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryAnalysisResponseDto })
  async queryWithAnalysis(@Body() queryDto: QueryAnalysisDto): Promise<QueryAnalysisResponseDto> {
    const startTime = Date.now();
    
    try {
      const result = await this.ragService.queryWithAnalysis(queryDto);
      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        metadata: {
          ...result.metadata,
          processingTime
        }
      };
    } catch (error) {
      this.logger.error('RAG查询失败:', error);
      throw error;
    }
  }

  @Post('documents')
  @ApiOperation({ summary: '添加文档到知识库' })
  @ApiResponse({ status: 201, description: '文档添加成功', type: DocumentProcessResponseDto })
  async addDocument(@Body() addDocumentDto: AddDocumentDto): Promise<DocumentProcessResponseDto> {
    const startTime = Date.now();
    
    try {
      const result = await this.ragService.addDocument(addDocumentDto);
      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        processingTime
      };
    } catch (error) {
      this.logger.error('文档添加失败:', error);
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({ summary: '检查RAG服务健康状态' })
  async healthCheck() {
    return await this.ragService.healthCheck();
  }
}
```

## 5. 主服务实现

```typescript
// src/rag/rag.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { QueryAnalysisService } from './services/query-analysis.service';
import { VectorRetrievalService } from './services/vector-retrieval.service';
import { AnswerGenerationService } from './services/answer-generation.service';
import { DocumentProcessingService } from './services/document-processing.service';
import { QueryAnalysisDto, QueryAnalysisResponseDto } from './dto/query-analysis.dto';
import { AddDocumentDto, DocumentProcessResponseDto } from './dto/document-management.dto';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly queryAnalysisService: QueryAnalysisService,
    private readonly vectorRetrievalService: VectorRetrievalService,
    private readonly answerGenerationService: AnswerGenerationService,
    private readonly documentProcessingService: DocumentProcessingService,
  ) {}

  async queryWithAnalysis(queryDto: QueryAnalysisDto): Promise<QueryAnalysisResponseDto> {
    const { question, model = 'qwen2.5', k = 3, scoreThreshold = 0.5 } = queryDto;
    
    try {
      // 1. 查询分析
      this.logger.log('开始查询分析...');
      const analyzedQuery = await this.queryAnalysisService.analyzeQuery(question);
      
      // 2. 文档检索
      this.logger.log('开始文档检索...');
      const retrievedDocs = await this.vectorRetrievalService.retrieveWithScore(analyzedQuery, k);
      
      // 3. 过滤低分文档
      const filteredDocs = retrievedDocs
        .filter(([doc, score]) => score >= scoreThreshold)
        .map(([doc, score]) => ({ ...doc, metadata: { ...doc.metadata, score } }));
      
      // 4. 生成答案
      this.logger.log('开始生成答案...');
      const answer = await this.answerGenerationService.generateAnswerWithModel(
        question,
        filteredDocs,
        model
      );
      
      return {
        success: true,
        answer,
        analyzedQuery,
        context: filteredDocs.map(doc => ({
          content: doc.pageContent,
          metadata: doc.metadata,
          score: doc.metadata.score
        })),
        metadata: {
          processingTime: 0, // 将在控制器中设置
          model,
          timestamp: new Date().toISOString(),
          documentsRetrieved: filteredDocs.length
        }
      };
    } catch (error) {
      this.logger.error('查询分析RAG处理失败:', error);
      throw error;
    }
  }

  async addDocument(addDocumentDto: AddDocumentDto): Promise<DocumentProcessResponseDto> {
    try {
      return await this.documentProcessingService.processDocument(addDocumentDto);
    } catch (error) {
      this.logger.error('文档添加失败:', error);
      throw error;
    }
  }

  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        queryAnalysis: 'healthy',
        vectorRetrieval: 'healthy',
        answerGeneration: 'healthy',
        documentProcessing: 'healthy'
      }
    };
  }
}
```

## 6. 模块配置

```typescript
// src/rag/rag.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { QueryAnalysisService } from './services/query-analysis.service';
import { VectorRetrievalService } from './services/vector-retrieval.service';
import { AnswerGenerationService } from './services/answer-generation.service';
import { DocumentProcessingService } from './services/document-processing.service';
import { ChromaVectorService } from './services/chroma-vector.service';
import { RagDocument } from './entities/rag-document.entity';
import { RagChunk } from './entities/rag-chunk.entity';
import { RagQuery } from './entities/rag-query.entity';
import { RagQueryResult } from './entities/rag-query-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RagDocument,
      RagChunk,
      RagQuery,
      RagQueryResult
    ])
  ],
  controllers: [RagController],
  providers: [
    RagService,
    QueryAnalysisService,
    VectorRetrievalService,
    AnswerGenerationService,
    DocumentProcessingService,
    ChromaVectorService
  ],
  exports: [RagService]
})
export class RagModule {}
```

## 7. 集成到主应用

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
// ... 其他导入
import { RagModule } from './rag/rag.module';

@Module({
  imports: [
    // ... 现有模块
    RagModule,
  ],
  // ... 其他配置
})
export class AppModule {}
```

## 8. 环境配置

在 `.env` 文件中添加RAG相关配置：

```env
# RAG配置
RAG_OLLAMA_BASE_URL=http://localhost:11434
RAG_CHROMA_URL=http://localhost:8000
RAG_EMBEDDING_MODEL=shaw/dmeta-embedding-zh
RAG_DEFAULT_LLM_MODEL=qwen2.5
RAG_CHUNK_SIZE=1000
RAG_CHUNK_OVERLAP=200
RAG_DEFAULT_K=3
RAG_DEFAULT_SCORE_THRESHOLD=0.5
```

## 9. 部署和测试

### 9.1 安装依赖

```bash
# 安装新的依赖包
npm install @langchain/ollama @langchain/community chromadb
```

### 9.2 启动外部服务

```bash
# 启动Ollama服务
ollama serve

# 拉取所需模型
ollama pull qwen2.5
ollama pull shaw/dmeta-embedding-zh

# 启动Chroma向量数据库
docker run -p 8000:8000 chromadb/chroma
```

### 9.3 测试API

```bash
# 测试查询分析RAG
curl -X POST http://localhost:3000/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "文章的结尾讲了langgraph的哪些优点？",
    "model": "qwen2.5",
    "k": 3
  }'

# 测试文档添加
curl -X POST http://localhost:3000/rag/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "LangGraph教程",
    "url": "http://wfcoding.com/articles/practice/0318/",
    "metadata": {"category": "tutorial"}
  }'
```

这个实现指南提供了完整的NestJS查询分析RAG模块实现方案，包含了所有核心组件的详细代码实现和配置说明。