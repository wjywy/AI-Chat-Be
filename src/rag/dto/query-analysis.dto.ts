import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryAnalysisDto {
  @ApiProperty({ description: '用户的自然语言查询' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'LLM模型名称',
    required: false,
    default: 'qwen2.5',
  })
  @IsOptional()
  @IsString()
  model?: string = 'qwen2.5';

  @ApiProperty({ description: '检索文档数量', required: false, default: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  k?: number = 3;

  @ApiProperty({ description: '相似度阈值', required: false, default: 0.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  scoreThreshold?: number = 0.5;
}

export class QueryAnalysisResponseDto {
  @ApiProperty({ description: '分析结果' })
  result: string;

  @ApiProperty({ description: '分析详情' })
  analysis: {
    rewritten_query?: string;
    intent?: string;
    entities?: string[];
    query_type?: string;
    confidence?: number;
  };

  @ApiProperty({ description: '重写后的查询' })
  rewritten_query?: string;

  @ApiProperty({ description: '查询意图' })
  intent?: string;

  @ApiProperty({ description: '提取的实体' })
  entities?: string[];

  @ApiProperty({ description: '查询类型' })
  query_type?: string;

  @ApiProperty({ description: '置信度' })
  confidence?: number;
}
