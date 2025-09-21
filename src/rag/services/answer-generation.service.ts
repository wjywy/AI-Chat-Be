import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { RagChunk } from '../entities';
import { RagQueryResponse } from '../interfaces';

interface GenerationContext {
  query: string;
  chunks: RagChunk[];
  analysisResult?: any;
}

@Injectable()
export class AnswerGenerationService {
  private readonly logger = new Logger(AnswerGenerationService.name);
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

  async generateAnswer(context: GenerationContext): Promise<RagQueryResponse> {
    try {
      const startTime = Date.now();

      if (!context.chunks || context.chunks.length === 0) {
        return this.generateNoContextAnswer(context.query);
      }

      // 构建上下文文档
      const contextDocs = this.buildContextDocuments(context.chunks);

      // 生成答案
      const answer = await this.generateContextualAnswer(
        context.query,
        contextDocs,
        context.analysisResult,
      );

      const processingTime = Date.now() - startTime;

      return {
        answer,
        context_documents: this.formatContextDocuments(context.chunks),
        metadata: {
          processing_time: processingTime,
          model_used: this.configService.get('rag.langchain.model'),
          sources_count: context.chunks.length,
          analysis_result: context.analysisResult,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Answer generation failed', error);
      throw new Error(`Answer generation failed: ${error.message}`);
    }
  }

  private async generateContextualAnswer(
    query: string,
    contextDocs: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    analysisResult?: any,
  ): Promise<string> {
    const answerPrompt = PromptTemplate.fromTemplate(`
      你是一个专业的AI助手，请基于提供的上下文文档回答用户的问题。
      
      上下文文档：
      {context}
      
      用户问题：{question}
      
      请遵循以下规则：
      1. 仅基于提供的上下文文档回答问题
      2. 如果上下文中没有相关信息，请明确说明
      3. 保持回答的准确性和相关性
      4. 使用清晰、专业的语言
      5. 如果可能，提供具体的引用或例子
      
      回答：
    `);

    const chain = RunnableSequence.from([
      answerPrompt,
      this.llm,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke({
      context: contextDocs,
      question: query,
    });

    return answer.trim();
  }

  private async generateNoContextAnswer(
    query: string,
  ): Promise<RagQueryResponse> {
    const noContextPrompt = PromptTemplate.fromTemplate(`
      用户问题：{question}
      
      很抱歉，我在知识库中没有找到与您问题相关的信息。
      请尝试：
      1. 重新表述您的问题
      2. 使用更具体的关键词
      3. 检查问题是否在我的知识范围内
      
      如果您认为这个问题应该有答案，请联系管理员更新知识库。
    `);

    const chain = RunnableSequence.from([
      noContextPrompt,
      this.llm,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke({
      question: query,
    });

    return {
      answer: answer.trim(),
      context_documents: [],
      metadata: {
        processing_time: 0,
        model_used: this.configService.get('rag.langchain.model'),
        sources_count: 0,
      },
      timestamp: new Date(),
    };
  }

  private buildContextDocuments(chunks: RagChunk[]): string {
    return chunks
      .map((chunk, index) => {
        const docTitle = chunk.document?.title || '未知文档';
        const section = chunk.section ? ` (${chunk.section})` : '';
        return `[文档 ${index + 1}] ${docTitle}${section}:\n${chunk.content}\n`;
      })
      .join('\n---\n\n');
  }

  private formatContextDocuments(chunks: RagChunk[]): any[] {
    return chunks.map((chunk, index) => ({
      id: chunk.id,
      document_id: chunk.document_id,
      document_title: chunk.document?.title || '未知文档',
      section: chunk.section,
      content: chunk.content.substring(0, 200) + '...', // 截取前200字符
      chunk_index: chunk.chunk_index,
      relevance_rank: index + 1,
    }));
  }

  async generateSummary(chunks: RagChunk[]): Promise<string> {
    try {
      if (!chunks || chunks.length === 0) {
        return '没有找到相关文档进行总结。';
      }

      const contextDocs = this.buildContextDocuments(chunks);

      const summaryPrompt = PromptTemplate.fromTemplate(`
        请对以下文档内容进行总结：
        
        文档内容：
        {context}
        
        请提供一个简洁、准确的总结，突出主要观点和关键信息。
        
        总结：
      `);

      const chain = RunnableSequence.from([
        summaryPrompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const summary = await chain.invoke({
        context: contextDocs,
      });

      return summary.trim();
    } catch (error) {
      this.logger.error('Summary generation failed', error);
      throw new Error(`Summary generation failed: ${error.message}`);
    }
  }

  async generateFollowUpQuestions(
    query: string,
    answer: string,
  ): Promise<string[]> {
    try {
      const followUpPrompt = PromptTemplate.fromTemplate(`
        基于用户的问题和回答，生成3个相关的后续问题：
        
        用户问题：{question}
        回答：{answer}
        
        请生成3个相关的后续问题，每行一个问题：
      `);

      const chain = RunnableSequence.from([
        followUpPrompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const result = await chain.invoke({
        question: query,
        answer: answer,
      });

      return result
        .trim()
        .split('\n')
        .filter((q) => q.trim().length > 0)
        .slice(0, 3);
    } catch (error) {
      this.logger.warn('Follow-up questions generation failed', error);
      return [];
    }
  }

  async evaluateAnswerQuality(
    query: string,
    answer: string,
    chunks: RagChunk[],
  ): Promise<number> {
    try {
      const contextDocs = this.buildContextDocuments(chunks);

      const evaluationPrompt = PromptTemplate.fromTemplate(`
        评估以下回答的质量（0-1分）：
        
        问题：{question}
        上下文：{context}
        回答：{answer}
        
        评估标准：
        - 准确性：回答是否基于上下文准确回答问题
        - 完整性：回答是否完整覆盖问题要点
        - 相关性：回答是否与问题高度相关
        - 清晰度：回答是否清晰易懂
        
        请只返回一个0-1之间的数字分数：
      `);

      const chain = RunnableSequence.from([
        evaluationPrompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const result = await chain.invoke({
        question: query,
        context: contextDocs,
        answer: answer,
      });

      const score = parseFloat(result.trim());
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
      this.logger.warn('Answer quality evaluation failed', error);
      return 0.5; // 默认中等质量
    }
  }
}
