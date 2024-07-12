export class ResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class PaginationResponseDto<T, P> {
  statusCode: number;
  message: string;
  data: T;
  pagination:P

  constructor(statusCode: number, message: string, data: T, pagination: P) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.pagination = pagination
  }
}