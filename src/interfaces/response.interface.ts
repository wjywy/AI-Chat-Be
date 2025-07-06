export interface ResponseResult<T> {
  code: number;
  msg: string;
  data: T;
}
