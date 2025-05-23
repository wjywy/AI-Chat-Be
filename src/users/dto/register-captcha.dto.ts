import { IsNotEmpty } from 'class-validator';

export class registerCaptchaDto {
  @IsNotEmpty({
    message: 'address不能为空',
  })
  address: string;
}
