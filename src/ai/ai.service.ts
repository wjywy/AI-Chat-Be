import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private defaultMessage = 'you are a helpful assistant';

  constructor() {
    this.openai = new OpenAI({
      // 若没有配置环境变量，请用阿里云百炼API Key将下行替换为：apiKey: "sk-xxx",
      apiKey: 'sk-839c413f949049918615290813173f2f',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
    console.log('ai service');
  }

  async getAiWithFile(filePath: string) {
    const fileObject = await this.openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'fine-tune',
    });

    const res = `fileid://${fileObject.id}`;
    return res;
  }

  async getAiWithMessage() {}

  async getMain(message: string, filePath: string) {
    console.log('content', message);

    const content = filePath
      ? await this.getAiWithFile(filePath)
      : this.defaultMessage;
    console.log('content', content);

    const completion = await this.openai.chat.completions.create({
      model: 'qwen-long',
      messages: [
        { role: 'system', content: content },
        { role: 'user', content: `${message}` },
      ],
      stream: true,
      stream_options: {
        include_usage: true,
      },
    });

    return completion;
  }
}
