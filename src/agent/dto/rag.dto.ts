import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class RagQueryDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  k?: number = 3;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  scoreThreshold?: number = 0.5;
}

export class RagResponseDto {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    category: string;
    score: number;
    content: string;
  }>;
  query: string;
  timestamp: Date;
}

export class AddDocumentDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  category: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

// 新增PDF处理DTO
export class ProcessPdfDto {
  @IsString()
  filePath: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class PdfProcessResponseDto {
  success: boolean;
  message: string;
  documentId?: string;
  chunksCount?: number;
  extractedText?: string;
}
