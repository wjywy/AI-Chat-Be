import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  userId: number;
  username: string;
  nickName: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  private logger = new Logger();

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // 使用reflector的目的是从目标controller和handler上拿到require-login的metadata
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization;
      console.log(token, 'data');

      const data = this.jwtService.verify<JwtUserData>(token);
      console.log(data, 'data');
      request.user = {
        ...data,
      };
      return true;
    } catch (e) {
      this.logger.error(e, 'token 校验失败');
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
