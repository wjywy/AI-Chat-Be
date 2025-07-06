import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// 在文件顶部添加
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { Runnable } from '@langchain/core/runnables';

import { AgentType } from './entities/agent.entity';
import { GenerateContentDto } from './dto/create-agent.dto';
import { ChainValues } from '@langchain/core/utils/types';
import { MbtiService } from './services/mbti.service';

@Injectable()
export class AgentService {
  private llm: ChatOpenAI;
  // 修改类型定义为 Runnable 而不是 RunnableSequence
  private poetryAgent: Runnable<{ input: string }, string>;
  private xiaohongshuAgent: Runnable<{ input: string }, string>;
  private weatherAgent: Runnable<{ input: string }, ChainValues | string>;

  constructor(private readonly mbtiService: MbtiService) {
    // 初始化LangChain模型
    this.llm = new ChatOpenAI({
      openAIApiKey: 'sk-839c413f949049918615290813173f2f',
      configuration: {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      },
      modelName: 'qwen-long',
      temperature: 0.8,
    });

    this.initializeAgents();
  }

  private initializeAgents() {
    // 古诗词生成助手
    const poetryPrompt = PromptTemplate.fromTemplate(`
你是一位精通中国古典诗词的文学大师，擅长创作各种体裁的古诗词。

请根据用户的要求创作古诗词，要求：
1. 严格遵循古诗词的格律和韵律
2. 意境优美，用词典雅
3. 符合传统诗词的意象和表达方式

用户要求：{input}

请创作一首符合要求的古诗词：
`);

    // 添加StringOutputParser来确保返回字符串类型
    this.poetryAgent = poetryPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    // 小红书爆款文案生成助手
    const xiaohongshuPrompt = PromptTemplate.fromTemplate(`
你是一位专业的小红书内容创作专家，擅长创作吸引人的爆款文案。

请根据用户的主题创作小红书文案，要求：
1. 标题要有吸引力，使用数字、emoji、热门词汇
2. 内容要有价值，实用性强
3. 语言活泼有趣，贴近年轻人
4. 适当使用话题标签
5. 结构清晰，易于阅读
6. 长度适中，不超过500字

用户主题：{input}

请创作一篇小红书爆款文案：
`);

    this.xiaohongshuAgent = xiaohongshuPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const weatherPrompt = PromptTemplate.fromTemplate(`
    你是一个专业的天气查询助手，能够根据用户的问题查询当前的天气情况。

    用户问题：{input}

    请查询当前天气情况：
    `);
    this.weatherAgent = weatherPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());
  }

  // 生成内容的核心方法
  async generateContent(generateContentDto: GenerateContentDto): Promise<{
    success: boolean;
    data: {
      content: string | ChainValues;
      agentType: AgentType;
      prompt: string;
    };
  }> {
    console.log('generateContentDto', generateContentDto);
    const { agentType, prompt, options } = generateContentDto;

    try {
      let result: string | ChainValues;

      switch (agentType) {
        case AgentType.POETRY:
          result = await this.generatePoetry(prompt, options);
          break;
        case AgentType.XIAOHONGSHU:
          result = await this.generateXiaohongshu(prompt);
          break;
        case AgentType.MBTI:
          result = await this.generateMbti(prompt, options);
          break;
        default:
          throw new HttpException('不支持的Agent类型', HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: {
          content: result,
          agentType,
          prompt,
        },
      };
    } catch (error: any) {
      throw new HttpException(
        `生成内容失败: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 古诗词生成
  private async generatePoetry(
    prompt: string,
    options?: Record<string, any>,
  ): Promise<string> {
    console.log(options, 'options>>');
    // 使用invoke方法替代call方法
    const result = await this.poetryAgent.invoke({ input: prompt });
    return result;
  }

  // 小红书文案生成
  private async generateXiaohongshu(prompt: string): Promise<string> {
    // 使用invoke方法替代call方法
    const result = await this.xiaohongshuAgent.invoke({ input: prompt });
    return result;
  }

  // MBTI聊天生成
  private async generateMbti(
    prompt: string,
    options?: Record<string, any>,
  ): Promise<string> {
    const sessionId = options?.sessionId || 'default';
    const result = await this.mbtiService.chat(prompt, sessionId);
    return result;
  }

  // 获取预设的Agent模板
  getAgentTemplates() {
    return [
      {
        name: '古诗词生成助手',
        type: AgentType.POETRY,
        description:
          '专业的古诗词创作助手，能够根据主题、情感、场景等要求创作各种体裁的古诗词',
        examples: [
          '写一首关于春天的七言绝句',
          '创作一首思乡的五言律诗',
          '写一首描写月夜的词',
        ],
      },
      {
        name: '小红书爆款文案助手',
        type: AgentType.XIAOHONGSHU,
        description:
          '专业的小红书内容创作助手，擅长创作吸引人的爆款文案和种草内容',
        examples: [
          '护肤品推荐文案',
          '美食探店分享',
          '穿搭搭配指南',
          '旅行攻略分享',
        ],
      },
      {
        name: 'MBTI咨询师助手',
        type: AgentType.MBTI,
        description:
          '专业的MBTI咨询师助手，根据用户的MBTI类型提供个性化的情感支持和建议',
        examples: [
          '我是INFP，最近工作压力很大怎么办？',
          '作为ENTJ，如何更好地与团队沟通？',
          '我不知道我的MBTI类型，能帮我分析一下吗？',
        ],
      },
    ];
  }
}
