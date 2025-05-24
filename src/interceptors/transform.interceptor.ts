import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseResult } from '../interfaces/response.interface';

// 响应拦截器
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseResult<T>> {
    return next.handle().pipe(
      map((data: { code: number; msg: string; data: T }) => {
        // 如果已经是标准格式，直接返回
        if (
          data &&
          data.code !== undefined &&
          data.msg !== undefined &&
          data.data !== undefined
        ) {
          return data as ResponseResult<T>;
        }

        // 处理成功响应
        return {
          code: 1, // 成功响应统一使用 code: 1
          msg: data?.msg || '请求成功',
          data: (data?.data || data || {}) as T,
        };
      }),
    );
  }
}
