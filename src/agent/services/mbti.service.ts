import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';

@Injectable()
export class MbtiService {
  private mbtiInfo: Record<string, string>;
  private mbtiList: [string, ...string[]];
  private agentWithChatHistory: RunnableWithMessageHistory<any, any>;
  private sessionHistories: Map<string, ChatMessageHistory> = new Map();

  // 要根据用户的回答引导性提问
  constructor() {
    this.initializeMbtiData();
    this.initializeAgent();
  }

  private initializeMbtiData() {
    // 修改路径，使其指向源码目录而不是编译后的目录
    const mbtiInfoPath = path.resolve(
      process.cwd(),
      'src/agent/data/mbti-info.json',
    );
    const mbtiInfoBuffer = readFileSync(mbtiInfoPath);
    this.mbtiInfo = JSON.parse(mbtiInfoBuffer.toString());
    this.mbtiList = [
      'ISTJ',
      'ISFJ',
      'INFJ',
      'INTJ',
      'ISTP',
      'ISFP',
      'INFP',
      'INTP',
      'ESTP',
      'ESFP',
      'ENFP',
      'ENTP',
      'ESTJ',
      'ESFJ',
      'ENFJ',
      'ENTJ',
    ] as [string, ...string[]];
  }

  private async getMBTIChatChain() {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        '你是一个共情能力非常强的心理医生，并且很了解MBTI（迈尔斯-布里格斯性格类型指标)的各种人格类型，你的任务是根据来访者的 MBTI 和问题，给出针对性的情感支持，你的回答要富有感情、有深度和充足的情感支持，引导来访者乐观积极面对问题',
      ],
      [
        'human',
        '用户的 MBTI 类型是{type}, 这个类型的特点是{info}, 他的问题是{question}',
      ],
    ]);

    const model = new ChatOpenAI({
      openAIApiKey: 'sk-839c413f949049918615290813173f2f',
      configuration: {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      },
      modelName: 'qwen-plus',
      temperature: 0.4,
    });

    console.log(prompt, 'prompt');
    const mbtiChain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    return mbtiChain;
  }

  private async initializeAgent() {
    const mbtiChatChain = await this.getMBTIChatChain();

    const mbtiTool = new DynamicStructuredTool({
      name: 'get-mbti-chat',
      schema: z.object({
        type: z.enum(this.mbtiList).describe('用户的 MBTI 类型'),
        question: z.string().describe('用户的问题'),
      }),
      func: async ({ type, question }) => {
        const info = this.mbtiInfo[type.toLowerCase()];
        const res = await mbtiChatChain.invoke({ type, question, info });
        return res;
      },
      description: '根据用户的问题和 MBTI 类型，回答用户的问题',
    } as any);

    const tools = [mbtiTool];

    const agentPrompt = await ChatPromptTemplate.fromMessages([
      [
        'system',
        `你是一个用户接待的 agent，你的任务是：
        1. 识别用户的MBTI类型（如果用户提到了）
        2. 了解用户的具体问题或困惑
        3. 只有当你同时获得了用户的MBTI类型和具体问题时，才调用get-mbti-chat工具
        4. 如果用户只提到了MBTI类型但问题不够具体（如"该怎么办"、"怎么办"等），你应该询问更具体的问题
        5. 如果用户没有提到MBTI类型，你应该询问他们的MBTI类型
        
        记住：只有当问题足够具体和明确时才调用工具，否则继续询问以获取更多信息。`,
      ],
      new MessagesPlaceholder('history_message'),
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const llm = new ChatOpenAI({
      openAIApiKey: 'sk-839c413f949049918615290813173f2f',
      configuration: {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      },
      modelName: 'qwen-plus',
      temperature: 0.4,
    });

    const agent = await createOpenAIToolsAgent({
      llm,
      tools,
      prompt: agentPrompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    this.agentWithChatHistory = new RunnableWithMessageHistory({
      runnable: agentExecutor,
      getMessageHistory: (sessionId: string) => {
        if (!this.sessionHistories.has(sessionId)) {
          this.sessionHistories.set(sessionId, new ChatMessageHistory());
        }
        return this.sessionHistories.get(sessionId)!;
      },
      inputMessagesKey: 'input',
      historyMessagesKey: 'history_message',
    });
  }

  async chat(input: string, sessionId: string = 'default'): Promise<string> {
    const response = await this.agentWithChatHistory.invoke(
      {
        input,
      },
      {
        configurable: {
          sessionId,
        },
      },
    );

    console.log(response, 'response');

    return response.output;
  }
}
