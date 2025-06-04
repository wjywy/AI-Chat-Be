import { Request } from 'express';
import { Observable } from 'rxjs';

import {
  Controller,
  Post,
  Body,
  Param,
  Sse,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Req,
  Query,
} from '@nestjs/common';

import { RequireLogin } from 'src/custom.decorator';

import { ChatService } from './chat.service';

import { SendMessageDto } from './dto/send-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { SearchChatDto } from './dto/search-chat.dto';

@Controller('chat')
@RequireLogin()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  private logger = new Logger();

  // 创建一个新的会话
  @Post('createChat')
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() request: Request,
  ) {
    try {
      const { userId } = request.user;
      const { chatTitle } = createChatDto;
      const chat = await this.chatService.createChat({ chatTitle, userId });
      return {
        data: chat,
        msg: '会话创建成功',
      };
    } catch (error) {
      this.logger.error(`创建会话失败: ${error || '未知错误'}`);
      throw new HttpException(
        `创建会话失败: ${error || '未知错误'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('updateTitle')
  async updateTitle(@Body() updateTitleDto: UpdateTitleDto) {
    const { title, chatId } = updateTitleDto;
    await this.chatService.updateChatTitle({ title, chatId });
    return {
      msg: '修改成功',
      data: {},
    };
  }

  // 返回一日内的会话记录
  @Get('oneDayHistory')
  async getOneDayHistory(@Req() request: Request) {
    console.log(request.user, 'user');
    const { userId } = request.user;
    const data = await this.chatService.getOneDayHistory(userId);

    return {
      msg: '获取成功',
      data,
    };
  }

  // 搜索会话(模糊搜索)
  @Get('searchChat')
  async findChat(
    @Query() searchChatDto: SearchChatDto,
    @Req() request: Request,
  ) {
    const { userId } = request.user;
    const data = await this.chatService.searchChat(searchChatDto, userId);

    return {
      msg: '搜索成功',
      data,
    };
  }

  // 获取用户的所有会话
  @Get('userChat')
  async getUserChats(@Req() request: Request) {
    const { userId } = request.user;
    console.log('userId', request.user);
    const chats = await this.chatService.getUserChats(userId);
    return {
      data: chats,
    };
  }

  // 获取单个会话
  @Get(':id')
  async getChatById(@Param('id') id: string) {
    const chat = await this.chatService.getChatById(id);
    return {
      data: chat,
    };
  }

  @Get('deleteChat/:id')
  async deleteChat(@Param('id') id: string) {
    await this.chatService.deleteChat(id);
    return {
      msg: '会话删除成功',
      data: {},
    };
  }

  // 获取单个会话的所有消息
  @Get('messages/:id')
  async getChatMessages(@Param('id') id: string) {
    const messages = await this.chatService.getChatMessages(id);
    return {
      data: messages,
    };
  }

  @Sse('getChat/:id')
  streamEvents(@Param('id') id: string): Observable<MessageEvent> {
    console.log('streamEvents', id);
    return this.chatService.getStreamEvents(id);
  }

  @Post('sendMessage')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    // 验证必要的参数
    if (!sendMessageDto.id || !sendMessageDto.message) {
      throw new HttpException(
        '缺少必要参数：chatId 或 message',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 调用 service 方法处理消息并通过 SSE 发送响应
    await this.chatService.useGeminiToChat(sendMessageDto);

    return {
      msg: '消息已发送并开始处理',
      data: {},
    };
  }
}
