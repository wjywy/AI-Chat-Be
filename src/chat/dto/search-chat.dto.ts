import { IsNotEmpty } from 'class-validator';
export class SearchChatDto {
  @IsNotEmpty({
    message: '请输入搜索关键字',
  })
  keyWord: string;
}
