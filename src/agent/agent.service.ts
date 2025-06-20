import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Runnable } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { AgentType } from './entities/agent.entity';
import { GenerateContentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentService {
  private llm: ChatOpenAI;
  // 修改类型定义为 Runnable 而不是 RunnableSequence
  private poetryAgent: Runnable<{ input: string }, string>;
  private xiaohongshuAgent: Runnable<{ input: string }, string>;

  constructor() {
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
  }

  // 生成内容的核心方法
  async generateContent(generateContentDto: GenerateContentDto): Promise<{
    success: boolean;
    data: {
      content: string;
      agentType: AgentType;
      prompt: string;
    };
  }> {
    console.log('generateContentDto', generateContentDto);
    const { agentType, prompt, options } = generateContentDto;

    try {
      let result: string;

      switch (agentType) {
        case AgentType.POETRY:
          result = await this.generatePoetry(prompt, options);
          break;
        case AgentType.XIAOHONGSHU:
          result = await this.generateXiaohongshu(prompt);
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
    ];
  }
}
