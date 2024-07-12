import { Injectable } from '@nestjs/common';
import { PaginationResponseDto, ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseService {
  success<T>(data: T, message = 'Request successful', statusCode = 200): ResponseDto<T> {
    return new ResponseDto(statusCode, message, data);
  }

  error<T>(message = 'Request failed', statusCode = 400, data: T = null): ResponseDto<T> {
    return new ResponseDto(statusCode, message, data);
  }

  pagination<T, P>(data: T, pagination: P = null, message = 'Request successful', statusCode = 200): ResponseDto<T> {
    return new PaginationResponseDto(statusCode, message, data, pagination);
  }
}
