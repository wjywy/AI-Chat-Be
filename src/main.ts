import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
} from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // 跨域
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
