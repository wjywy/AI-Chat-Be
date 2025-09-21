import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDocumentDto {
  @ApiProperty({ description: '文档标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '网页URL（与content二选一）', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ description: '文档内容（与url二选一）', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '文档元数据', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class DocumentProcessResponseDto {
  @ApiProperty({ description: '是否成功' })
  success: boolean;

  @ApiProperty({ description: '处理消息' })
  message: string;

  @ApiProperty({ description: '文档ID' })
  documentId: string;

  @ApiProperty({ description: '分块数量' })
  chunksCount: number;

  @ApiProperty({ description: '处理时间（毫秒）' })
  processingTime: number;
}
