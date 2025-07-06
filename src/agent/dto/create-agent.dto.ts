import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { AgentType } from '../entities/agent.entity';

export class CreateAgentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(AgentType)
  type: AgentType;

  @IsString()
  systemPrompt: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class GenerateContentDto {
  @IsEnum(AgentType)
  agentType: AgentType;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}
