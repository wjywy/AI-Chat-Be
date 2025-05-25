import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty({
    message: 'File Id is required',
  })
  fileId: string;

  //   @IsNotEmpty({
  //     message: 'File Chunk is Not Empty',
  //   })
  chunk: any;

  @IsNotEmpty({
    message: 'File Index is required',
  })
  index: number;

  @IsNotEmpty({
    message: 'File Name is required',
  })
  fileName: string;

  @IsNotEmpty({
    message: 'Chunk Hash is required',
  })
  chunkHash: string;
}
