import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  chatTitle: string;

  @IsNotEmpty({
    message: 'userId is required',
  })
  userId: number;
}
