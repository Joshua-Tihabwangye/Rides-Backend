import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiResponseService } from './api-response.service';
import { getRequestId } from '../utils/request-id';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly apiResponse: ApiResponseService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const requestId = getRequestId(request);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const details = typeof payload === 'string' ? undefined : payload;
      const message = typeof payload === 'string' ? payload : exception.message;

      response.status(status).json(
        this.apiResponse.error({
          code: this.codeFromStatus(status),
          message,
          details,
          requestId,
        }),
      );
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      this.apiResponse.error({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error',
        requestId,
      }),
    );
  }

  private codeFromStatus(status: number): string {
    if (status >= 500) {
      return 'INTERNAL_SERVER_ERROR';
    }
    if (status === 401) {
      return 'UNAUTHORIZED';
    }
    if (status === 403) {
      return 'FORBIDDEN';
    }
    if (status === 404) {
      return 'NOT_FOUND';
    }
    if (status === 400) {
      return 'BAD_REQUEST';
    }
    if (status === 422) {
      return 'VALIDATION_ERROR';
    }
    return 'REQUEST_FAILED';
  }
}
