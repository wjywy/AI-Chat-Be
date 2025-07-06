import { IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  chatTitle: string;
}
