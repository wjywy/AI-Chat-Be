import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

// 配置
import ragConfig from './config/rag.config';

// 实体
import { RagDocument, RagChunk, RagQuery, RagQueryResult } from './entities';

// 服务
import {
  QueryAnalysisService,
  VectorRetrievalService,
  AnswerGenerationService,
  DocumentManagementService,
  RagService,
} from './services';

// 控制器
import { RagController } from './controllers/rag.controller';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forFeature(ragConfig),

    // TypeORM 实体注册
    TypeOrmModule.forFeature([RagDocument, RagChunk, RagQuery, RagQueryResult]),

    // Multer 文件上传配置
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1,
      },
      fileFilter: (req, file, callback) => {
        // 允许的文件类型
        const allowedMimeTypes = [
          'text/plain',
          'text/markdown',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/html',
          'application/json',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
      },
    }),
  ],
  controllers: [RagController],
  providers: [
    // 核心服务
    QueryAnalysisService,
    VectorRetrievalService,
    AnswerGenerationService,
    DocumentManagementService,
    RagService,
  ],
  exports: [
    // 导出服务供其他模块使用
    QueryAnalysisService,
    VectorRetrievalService,
    AnswerGenerationService,
    DocumentManagementService,
    RagService,
  ],
})
export class RagModule {}
