import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RequireLogin } from 'src/custom.decorator';
import { FileService } from './file.service';

import {
  CancelFileDto,
  CheckFileDto,
  MergeFileDto,
  UploadFileDto,
} from './dto';

@Controller('file')
@RequireLogin()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  private logger = new Logger();

  @Get('check')
  checkFile(@Query() checkFileDto: CheckFileDto) {
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
