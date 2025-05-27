import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { FileModule } from 'src/file/file.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), FileModule, AiModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
