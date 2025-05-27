import { JwtService } from '@nestjs/jwt';
import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { registerCaptchaDto } from './dto/register-captcha.dto';

import { UsersService } from './users.service';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }

  @Get('register-captcha')
  async sendCaptcha(@Query() { address }: registerCaptchaDto) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 60 * 5);
    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return {
      message: '验证码发送成功',
      data: {},
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const userInfo = await this.usersService.login(loginUserDto);
    const { userName, nickName } = userInfo;
    const needReturnLoginInfo = {
      userName,
      nickName,
      token: '',
    };
    const token = this.jwtService.sign(
      {
        userName,
        nickName,
        userId: userInfo.id,
      },
      {
        expiresIn: '7d',
      },
    );
    needReturnLoginInfo.token = token;
    return {
      message: '登录成功',
      data: needReturnLoginInfo,
    };
  }
}
