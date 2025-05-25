import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  CancelFileDto,
  CheckFileDto,
  MergeFileDto,
  UploadFileDto,
} from './dto';

import { Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/entities/chat.entity';
import { Message } from '../chat/entities/message.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequireLogin } from 'src/custom.decorator';

@Controller('file')
@RequireLogin()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  private logger = new Logger();

  @InjectRepository(Chat)
  private chatRepository: Repository<Chat>;

  @InjectRepository(Message)
  private messageRepository: Repository<Message>;

  @Get('check')
  checkFile(@Query() checkFileDto: CheckFileDto) {
    this.logger.log('checkFileDto', checkFileDto);
    console.log('checkFileDto', checkFileDto);
    return this.fileService.checkFile(checkFileDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('chunk'))
  uploadFile(@Body() uploadFileDto: UploadFileDto, @UploadedFile() file: any) {
    return this.fileService.uploadFile({
      ...uploadFileDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      chunk: file,
    });
  }

  @Post('merge')
  mergeFile(@Body() mergeFileDto: MergeFileDto) {
    return this.fileService.mergeFile(mergeFileDto);
  }

  @Post('cancel')
  cancelFile(@Body() cancelFileDto: CancelFileDto) {
    return this.fileService.cancelFile(cancelFileDto);
  }
}
