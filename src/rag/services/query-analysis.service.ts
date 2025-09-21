import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { QueryAnalysisDto, QueryAnalysisResponseDto } from '../dto';

@Injectable()
export class QueryAnalysisService {
  private readonly logger = new Logger(QueryAnalysisService.name);
  private readonly llm: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    const ragConfig = this.configService.get('rag');
    this.llm = new ChatOpenAI({
      openAIApiKey: ragConfig.langchain.openaiApiKey,
      modelName: ragConfig.langchain.model,
      temperature: ragConfig.langchain.temperature,
      maxTokens: ragConfig.langchain.maxTokens,
    });
  }

  async analyzeQuery(
    queryDto: QueryAnalysisDto,
  ): Promise<QueryAnalysisResponseDto> {
    try {
      const startTime = Date.now();

      // 查询分析提示模板
      const analysisPrompt = PromptTemplate.fromTemplate(`
        分析以下用户查询，并提供结构化的分析结果：
        
        用户查询: {query}
        
        请分析并返回JSON格式的结果，包含以下字段：
        - intent: 查询意图（如：信息检索、问答、总结等）
        - keywords: 关键词列表
        - section: 相关文档章节（如果能识别）
        - complexity: 复杂度（simple/medium/complex）
        - rewritten_query: 重写后的查询（更适合检索）
        
        返回格式：
        {{
          "intent": "查询意图",
          "keywords": ["关键词1", "关键词2"],
          "section": "相关章节或null",
          "complexity": "复杂度",
          "rewritten_query": "重写后的查询"
        }}
      `);

      const chain = analysisPrompt
        .pipe(this.llm)
        .pipe(new StringOutputParser());

      const result = await chain.invoke({
        query: queryDto.question,
      });

      // 解析LLM返回的JSON结果
      let analysisResult;
      try {
        analysisResult = JSON.parse(result);
      } catch (parseError) {
        this.logger.warn(
          'Failed to parse LLM response as JSON, using fallback',
          parseError,
        );
        const validIntents = [
          'information_seeking',
          'comparison',
          'explanation',
          'how_to',
          'troubleshooting',
          'other',
        ];
        analysisResult = {
          intent: validIntents.includes(analysisResult?.intent)
            ? analysisResult.intent
            : 'information_seeking',
          keywords: this.extractKeywords(queryDto.question),
          section: null,
          complexity: 'medium',
          rewritten_query: queryDto.question,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const processingTime = Date.now() - startTime;

      return {
        result: 'Query analysis completed',
        analysis: analysisResult,
        rewritten_query: analysisResult.rewritten_query,
        intent: analysisResult.intent,
        entities: analysisResult.entities?.map((e) => e.value) || [],
        query_type: analysisResult.intent,
        confidence: analysisResult.confidence,
      };
    } catch (error) {
      this.logger.error('Query analysis failed', error);
      throw new Error(`Query analysis failed: ${error.message}`);
    }
  }

  private extractKeywords(query: string): string[] {
    // 简单的关键词提取逻辑
    const stopWords = [
      '的',
      '是',
      '在',
      '有',
      '和',
      '与',
      '或',
      '但',
      '如果',
      '因为',
      '所以',
    ];
    const words = query
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 1 && !stopWords.includes(word));

    return [...new Set(words)];
  }

  async rewriteQuery(originalQuery: string): Promise<string> {
    try {
      const rewritePrompt = PromptTemplate.fromTemplate(`
        将以下查询重写为更适合文档检索的形式，保持原意但使用更精确的关键词：
        
        原查询: {query}
        
        重写后的查询:
      `);

      const chain = rewritePrompt.pipe(this.llm).pipe(new StringOutputParser());

      const rewrittenQuery = await chain.invoke({
        query: originalQuery,
      });

      return rewrittenQuery.trim();
    } catch (error) {
      this.logger.warn('Query rewrite failed, using original query', error);
      return originalQuery;
    }
  }
}
