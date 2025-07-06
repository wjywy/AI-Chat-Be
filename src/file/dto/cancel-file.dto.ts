import { IsNotEmpty } from 'class-validator';
export class CancelFileDto {
  @IsNotEmpty({
    message: 'File Id is required',
  })
  fileId: string;
}
