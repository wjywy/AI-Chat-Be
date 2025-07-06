import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 构建错误响应
    const errorResponse = {
      code: status, // 错误响应使用 HTTP 状态码作为 code
      msg:
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse.message
          : exception.message,
      data: {},
    };

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 构建错误响应
    const errorResponse = {
      code: status,
      msg: (exception as Error).message || '服务器内部错误',
      data: {},
    };

    response.status(status).json(errorResponse);
  }
}
