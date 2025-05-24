import { IsNotEmpty } from 'class-validator';

export class MergeFileDto {
  @IsNotEmpty({
    message: 'File name is required',
  })
  fileName: string;

  @IsNotEmpty({
    message: 'File Id is required',
  })
  fileId: string;

  @IsNotEmpty({
    message: 'FileNumber is required',
  })
  totalChunks: number;
}
