import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  CancelFileDto,
  CheckFileDto,
  MergeFileDto,
  UploadFileDto,
} from './dto';
import { Chat } from '../chat/entities/chat.entity';
import { FileEntity } from './entities/file.entity';
import { BASE_URL } from 'src/constant';

@Injectable()
export class FileService {
  @InjectRepository(Chat)
  private chatRepository: Repository<Chat>;

  @InjectRepository(FileEntity)
  private fileRepository: Repository<FileEntity>;

  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly tempDir = path.join(process.cwd(), 'uploads', 'temp');

  constructor() {
    // 确保上传目录存在
    this.ensureDirectoryExists(this.uploadDir);
    this.ensureDirectoryExists(this.tempDir);
  }

  private ensureDirectoryExists(directory: string) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  private calculateHash(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  // 添加一个私有方法来转换绝对路径为相对URL路径
  private getRelativeFilePath(absolutePath: string): string {
    // 将绝对路径转换为相对于uploads目录的路径
    const relativePath = path.relative(this.uploadDir, absolutePath);
    // 转换为URL格式，使用正斜杠
    return `${BASE_URL}/uploads/${relativePath.replace(/\\/g, '/')}`;
  }

  async checkFile(checkFileDto: CheckFileDto) {
    const { fileId, fileName, chatId } = checkFileDto;
    // 查找文件记录
    let fileRecord = await this.fileRepository.findOne({
      where: { fileId },
    });
    // 如果文件记录不存在，则创建新记录
    if (!fileRecord) {
      fileRecord = new FileEntity();
      Object.assign(fileRecord, {
        fileId,
        fileName,
        chatId: chatId ? chatId : null,
        uploadedChunks: 0,
        isCompleted: false,
        isCanceled: false,
      });
      await this.fileRepository.save(fileRecord);

      return {
        msg: '文件检查成功，需要上传',
        data: {
          fileStatus: 0,
          uploaded: [],
          uploadedChunks: 0,
          isCompleted: false,
        },
      };
    }

    // 如果文件已完成上传或已取消，返回相应状态
    if (fileRecord.isCompleted) {
      return {
        msg: '文件已上传完成',
        data: {
          fileStatus: 1,
          isCompleted: true,
          filePath: this.getRelativeFilePath(fileRecord.filePath),
          fileName: fileName,
        },
      };
    }

    if (fileRecord.isCanceled) {
      return {
        msg: '无该文件记录，可重新上传',
        data: {
          fileStatus: 0,
          isCanceled: true,
        },
      };
    }

    // 获取已上传的切片列表
    const chunkDir = path.join(this.tempDir, fileId);
    let uploadedChunks: number[] = [];

    if (fs.existsSync(chunkDir)) {
      uploadedChunks = fs
        .readdirSync(chunkDir)
        .map(Number)
        .sort((a, b) => a - b);
    }

    return {
      msg: '文件检查成功，需要继续上传wow',
      data: {
        fileStatus: 2,
        uploaded: uploadedChunks,
        uploadedChunks: fileRecord.uploadedChunks,
        isCompleted: false,
      },
    };
  }

  async uploadFile(uploadFileDto: UploadFileDto) {
    const { fileId, index, chunkHash } = uploadFileDto;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chunk = uploadFileDto.chunk;

    // 获取文件记录
    const fileRecord = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!fileRecord) {
      throw new HttpException('文件记录不存在', HttpStatus.BAD_REQUEST);
    }
    // 确保临时目录存在
    const chunkDir = path.join(this.tempDir, fileId);
    this.ensureDirectoryExists(chunkDir);

    // 保存切片文件
    const chunkPath = path.join(chunkDir, `${index}`);
    // 验证切片哈希
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const buffer = chunk.buffer;
    const calculatedHash = this.calculateHash(buffer);

    if (calculatedHash !== chunkHash) {
      throw new HttpException('切片校验失败', HttpStatus.BAD_REQUEST);
    }

    // 写入切片文件
    fs.writeFileSync(chunkPath, buffer);

    // 更新已上传切片数量
    fileRecord.uploadedChunks += 1;
    await this.fileRepository.save(fileRecord);

    return {
      msg: '切片上传成功',
      data: {
        chunkHash,
      },
    };
  }

  async mergeFile(mergeFileDto: MergeFileDto) {
    const { fileId, fileName, totalChunks } = mergeFileDto;

    // 获取文件记录
    const fileRecord = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!fileRecord) {
      throw new HttpException('文件记录不存在', HttpStatus.BAD_REQUEST);
    }

    // 检查是否所有切片都已上传
    if (fileRecord.uploadedChunks !== totalChunks) {
      throw new HttpException(
        `切片数量不匹配，已上传 ${fileRecord.uploadedChunks}，总共 ${totalChunks}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 合并文件
    const chunkDir = path.join(this.tempDir, fileId);
    const filePath = path.join(this.uploadDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    // 按顺序合并切片
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, `${i}`);
      const chunkBuffer = fs.readFileSync(chunkPath);
      writeStream.write(chunkBuffer);

      // 删除已合并的切片
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    // 更新文件记录
    fileRecord.isCompleted = true;
    fileRecord.totalChunks = totalChunks;
    fileRecord.filePath = this.getRelativeFilePath(filePath);
    await this.fileRepository.save(fileRecord);

    // 删除临时目录
    fs.rmdirSync(chunkDir);

    await this.attachFileToChat(fileId, fileRecord.chatId);

    return {
      msg: '文件合并成功',
      data: {
        filePath: this.getRelativeFilePath(filePath),
        fileName: fileName,
      },
    };
  }

  async cancelFile(cancelFileDto: CancelFileDto) {
    const { fileId } = cancelFileDto;

    // 获取文件记录
    const fileRecord = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!fileRecord) {
      throw new HttpException('文件记录不存在', HttpStatus.BAD_REQUEST);
    }

    // 删除临时目录中的切片
    const chunkDir = path.join(this.tempDir, fileId);
    if (fs.existsSync(chunkDir)) {
      // 删除目录中的所有文件
      const files = fs.readdirSync(chunkDir);
      for (const file of files) {
        fs.unlinkSync(path.join(chunkDir, file));
      }
      // 删除目录
      fs.rmdirSync(chunkDir);
    }

    // 更新文件记录
    fileRecord.isCanceled = true;
    await this.fileRepository.save(fileRecord);

    return {
      code: 1,
      msg: '取消上传成功',
      data: {},
    };
  }

  // 为聊天添加文件附件
  async attachFileToChat(fileId: string, chatId: string) {
    const fileRecord = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!fileRecord) {
      throw new HttpException('文件记录不存在', HttpStatus.BAD_REQUEST);
    }

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new HttpException('聊天', HttpStatus.BAD_REQUEST);
    }

    // fileRecord.chatId = chatId;
    fileRecord.chat = chat;
    await this.fileRepository.save(fileRecord);

    return {
      msg: '文件已关联到聊天',
      data: {
        fileId,
        chatId,
      },
    };
  }

  // 获取聊天的所有文件
  async getChatFiles(chatId: string) {
    const files = await this.fileRepository.find({
      where: { chatId, isCompleted: true },
    });

    return {
      code: 1,
      msg: '获取聊天文件成功',
      data: files,
    };
  }

  async getFile(fileId: string) {
    const file = await this.fileRepository.findOne({
      where: { fileId },
    });
    if (!file) {
      throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
    }
    return {
      msg: '获取文件成功',
      data: file,
    };
  }
}
