import { Repository } from 'typeorm';

import {
  HttpException,
  Injectable,
  Logger,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

import { RedisService } from '../redis/redis.service';
import { User } from './entities/user.entity';

import { md5 } from '../util';

@Injectable()
export class UsersService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  async register({ userName, password, nickName, captcha }: RegisterUserDto) {
    const userCaptcha = await this.redisService.get(`captcha_${userName}`);

    if (!userCaptcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (captcha.toUpperCase() !== userCaptcha.toUpperCase()) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const isExistUser = await this.userRepository.findOneBy({
      userName,
    });

    if (isExistUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.userName = userName;
    newUser.password = md5(password);
    newUser.nickName = nickName || 'MoMo';

    try {
      await this.userRepository.save(newUser);
      return {
        message: '注册成功',
        data: {},
      };
    } catch (error) {
      this.logger.error(error, UsersService);
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login({ userName, password }: LoginUserDto) {
    const userInfo = await this.userRepository.findOne({
      where: {
        userName,
      },
    });

    if (!userInfo) {
      throw new HttpException('用户not found', HttpStatus.BAD_REQUEST);
    }

    if (userInfo.password !== md5(password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    return {
      ...userInfo,
      token: '',
    };
  }
}
