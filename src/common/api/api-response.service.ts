import { Injectable } from '@nestjs/common';
import type { ApiErrorResponse, ApiSuccessResponse } from './api.types';

@Injectable()
export class ApiResponseService {
  success<T>(input: {
    code?: string;
    message?: string;
    requestId: string;
    data: T;
  }): ApiSuccessResponse<T> {
    return {
      code: input.code ?? 'OK',
      message: input.message ?? 'Success',
      requestId: input.requestId,
      data: input.data,
    };
  }

  error(input: {
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
  }): ApiErrorResponse {
    return {
      code: input.code,
      message: input.message,
      requestId: input.requestId,
      details: input.details,
    };
  }
}
