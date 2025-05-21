import { IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  userName: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @Length(6, 20, {
    message: '密码长度为6-20位',
  })
  password: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
