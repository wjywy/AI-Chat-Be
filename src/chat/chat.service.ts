import { Observable, Subject } from 'rxjs';
import { Between, Like, Repository } from 'typeorm';

import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FileContent, Message, MessageRole } from './entities/message.entity';
import { Chat } from './entities/chat.entity';

import { AiService } from 'src/ai/ai.service';
import { FileService } from 'src/file/file.service';

import { UpdateTitleDto } from './dto/update-title.dto';
import { SearchChatDto } from './dto/search-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  private chatSubjects = new Map<string, Subject<MessageEvent>>();

  private logger = new Logger();

  @Inject(FileService)
  private fileService: FileService;

  @Inject(AiService)
  private aiService: AiService;

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

  async useGeminiToChat({ id, message, imgUrl, fileId }: SendMessageDto) {
    try {
      let filePath = '';
      const fileContent: FileContent[] = [];
      // 用户上传了文件
      if (fileId) {
        try {
          const { data: file } = await this.fileService.getFile(fileId); // 获取文件列表

          filePath = file.filePath;
          console.log('filePathsss', filePath);
          fileContent.push({
            fileId,
            fileName: file.filePath,
          });
        } catch (error) {
          this.logger.error(`获取文件 ${fileId} 出错：${error}`);
        }
      }

      await this.saveMessage(
        id,
        message,
        MessageRole.USER,
        imgUrl,
        fileContent,
      ); // 保存用户消息到数据库

      const completion = await this.aiService.getMain(
        message,
        filePath,
        imgUrl,
      );

      let fullContent = '';
      for await (const chunk of completion) {
        if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
          const content = chunk.choices[0].delta.content || '';
          fullContent += content;

          // 通过SSE发送每个块到前端
          this.sendMessageToChat(id, {
            type: 'chunk',
            content: content,
            isComplete: false,
          });
        }
      }

      // 发送完整内容和完成标志
      this.sendMessageToChat(id, {
        type: 'complete',
        content: fullContent,
        isComplete: true,
      });

      await this.saveMessage(id, fullContent, MessageRole.SYSTEM); // 保存AI的响应到数据库

      this.logger.log(`聊天 ${id} 的完整响应已发送`);
    } catch (error) {
      this.logger.error(`聊天 ${id} 出错：${error}`);

      // 发送错误信息到前端
      this.sendMessageToChat(id, {
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

  async saveMessage(
    chatId: string,
    content: string,
    role: MessageRole,
    imgUrl?: string[],
    fileContent?: FileContent[],
  ) {
    const message = this.messageRepository.create({
      chatId,
      content,
      role,
      imgUrl,
      fileContent,
    });

    return await this.messageRepository.save(message);
  }

  async getChatMessages(chatId: string) {
    return await this.messageRepository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
  }

  async createChat({
    chatTitle,
    userId,
  }: {
    chatTitle: string;
    userId: number;
  }) {
    const chat = this.chatRepository.create({
      userId,
      title: chatTitle.slice(0, 8) || '新对话',
    });

    return await this.chatRepository.save(chat);
  }

  // 更新会话标题
  async updateChatTitle({ title, chatId }: UpdateTitleDto) {
    const chat = await this.getChatById(chatId);
    if (!chat) {
      throw new HttpException('找不到对应的会话', HttpStatus.NOT_FOUND);
    }
    chat.title = title;
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

  async searchChat({ keyWord }: SearchChatDto, userId: number) {
    return await this.chatRepository.find({
      where: { title: Like(`%${keyWord}%`), isActive: true, userId },
      order: { updateTime: 'DESC' },
    });
  }

  async getOneDayHistory(userId: number) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0); // 设置为当天00:00:00.000 UTC时间

    const end = new Date();
    end.setUTCHours(23, 59, 59, 999); // 设置为当天23:59:59.999 UTC时间

    return await this.chatRepository.find({
      where: {
        userId,
        isActive: true,
        createTime: Between(start, end), // 直接进行UTC时间比较
      },
    });
  }
}
