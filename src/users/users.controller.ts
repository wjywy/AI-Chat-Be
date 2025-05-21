import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common';

import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { JwtService } from '@nestjs/jwt';
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
  async sendCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 60 * 5);

    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });

    return {
      code: 200,
      data: '发送成功',
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const needReturnLoginInfo = await this.usersService.login(loginUserDto);
    // 接下来会加一下 JWT 方案
    const token = this.jwtService.sign(needReturnLoginInfo, {
      expiresIn: '7d',
    });

    needReturnLoginInfo.token = token;

    return {
      code: 200,
      data: needReturnLoginInfo,
    };
  }
}
