import OpenAI from 'openai';
import * as fs from 'fs';

import { Injectable } from '@nestjs/common';

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

  getAiWithImg(message: string, imgUrl: string[]) {
    const imgContent: {
      type: 'image_url';
      image_url: { url: string };
    }[] = imgUrl.map((item) => {
      return {
        type: 'image_url',
        image_url: { url: item },
      };
    });

    const messageContent: {
      type: 'text';
      text: string;
    } = {
      type: 'text',
      text: message,
    };

    return [messageContent, ...imgContent];
  }

  async getMain(message: string, filePath: string, imgUrl?: string[]) {
    console.log('filePath', imgUrl);
    const content = filePath
      ? await this.getAiWithFile(filePath)
      : this.defaultMessage;

    const userContent = imgUrl ? this.getAiWithImg(message, imgUrl) : message;

    const completion = await this.openai.chat.completions.create({
      model: 'qwen-vl-max',
      messages: [
        { role: 'system', content: content },
        { role: 'user', content: userContent },
      ],
      stream: true,
      stream_options: {
        include_usage: true,
      },
    });

    return completion;
  }
}
