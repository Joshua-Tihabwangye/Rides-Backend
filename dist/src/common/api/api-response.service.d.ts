import type { ApiErrorResponse, ApiSuccessResponse } from './api.types';
export declare class ApiResponseService {
    success<T>(input: {
        code?: string;
        message?: string;
        requestId: string;
        data: T;
    }): ApiSuccessResponse<T>;
    error(input: {
        code: string;
        message: string;
        requestId: string;
        details?: unknown;
    }): ApiErrorResponse;
}
