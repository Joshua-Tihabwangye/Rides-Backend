import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ApiResponseService } from './api-response.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly apiResponse;
    constructor(apiResponse: ApiResponseService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private codeFromStatus;
}
