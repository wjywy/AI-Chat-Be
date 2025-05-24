import { IsNotEmpty } from 'class-validator';

export class CheckFileDto {
  @IsNotEmpty({
    message: 'File name is required',
  })
  fileName: string;

  @IsNotEmpty({
    message: 'File Id is required',
  })
  fileId: string;

  @IsNotEmpty({
    message: 'Chat Id is required',
  })
  chatId: string;
}
