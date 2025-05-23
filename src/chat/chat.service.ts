import OpenAI from 'openai';

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Message, MessageRole } from './entities/message.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  private chatSubjects = new Map<string, Subject<MessageEvent>>();

  private logger = new Logger();

  @InjectRepository(Chat)
  private chatRepository: Repository<Chat>;

  @InjectRepository(Message)
  private messageRepository: Repository<Message>;

  constructor() {}

  getStreamEvents(chatId: string): Observable<MessageEvent> {
    if (!this.chatSubjects.has(chatId)) {
      this.chatSubjects.set(chatId, new Subject<MessageEvent>());
    }

    const subject = this.chatSubjects.get(chatId);
    if (!subject) {
      throw new HttpException('找不到对应的聊天主题', HttpStatus.NOT_FOUND);
    }
    return subject.asObservable();
  }

  sendMessageToChat(chatId: string, message: any) {
    if (this.chatSubjects.has(chatId)) {
      const subject = this.chatSubjects.get(chatId);
      subject?.next(
        new MessageEvent('message', {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: message,
          lastEventId: String(Date.now()), // 对应 id
        }),
      );
    }
  }

  async useGeminiToChat(chatId: string, userMessage: string) {
    try {
      const openai = new OpenAI({
        // 若没有配置环境变量，请用阿里云百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: 'sk-839c413f949049918615290813173f2f',
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      });

      await this.saveMessage(chatId, userMessage, MessageRole.USER); // 保存用户消息到数据库

      const completion = await openai.chat.completions.create({
        model: 'qwen-plus', //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage },
        ],
        stream: true,
        stream_options: {
          include_usage: true,
        },
      });

      let fullContent = '';
      for await (const chunk of completion) {
        if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
          const content = chunk.choices[0].delta.content || '';
          fullContent += content;

          // 通过SSE发送每个块到前端
          this.sendMessageToChat(chatId, {
            type: 'chunk',
            content: content,
            isComplete: false,
          });
        }
      }

      // 发送完整内容和完成标志
      this.sendMessageToChat(chatId, {
        type: 'complete',
        content: fullContent,
        isComplete: true,
      });

      await this.saveMessage(chatId, fullContent, MessageRole.SYSTEM); // 保存AI的响应到数据库

      this.logger.log(`聊天 ${chatId} 的完整响应已发送`);
    } catch (error) {
      this.logger.error(`聊天 ${chatId} 出错：${error}`);

      // 发送错误信息到前端
      this.sendMessageToChat(chatId, {
        type: 'error',
        content: `发生错误: ${error || '未知错误'}`,
        isComplete: true,
      });

      this.logger.log(
        '请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code',
      );

      throw new HttpException(
        `聊天出错: ${error || '未知错误'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveMessage(chatId: string, content: string, role: MessageRole) {
    const message = this.messageRepository.create({
      chatId,
      content,
      role,
    });

    return await this.messageRepository.save(message);
  }

  async getChatMessages(chatId: string) {
    return await this.messageRepository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
  }

  async createChat({ chatTitle, userId }: CreateChatDto) {
    const chat = this.chatRepository.create({
      userId,
      title: chatTitle || '新对话',
    });

    return await this.chatRepository.save(chat);
  }

  async getUserChats(userId: number) {
    return await this.chatRepository.find({
      where: { userId, isActive: true },
      order: { updateTime: 'DESC' },
    });
  }

  async getChatById(id: string) {
    const chat = await this.chatRepository.findOne({
      where: { id, isActive: true },
    });

    if (!chat) {
      throw new HttpException('找不到对应的会话', HttpStatus.NOT_FOUND);
    }

    return chat;
  }

  async deleteChat(id: string) {
    const chat = await this.getChatById(id);

    if (!chat) {
      throw new HttpException('找不到对应的会话', HttpStatus.NOT_FOUND);
    }

    chat.isActive = false;
    await this.chatRepository.save(chat);
  }
}
