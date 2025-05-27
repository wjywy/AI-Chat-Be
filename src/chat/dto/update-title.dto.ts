import { IsNotEmpty } from 'class-validator';
export class UpdateTitleDto {
  @IsNotEmpty({
    message: '标题不能为空',
  })
  title: string;

  @IsNotEmpty({
    message: 'chat id 不能为空',
  })
  chatId: string;
}
