import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;

  @IsNotEmpty({
    message: 'message不能为空',
  })
  message: string;

  imgUrl?: string[];

  fileId?: string;
}
