export interface ApiSuccessResponse<T> {
  code: string;
  message: string;
  requestId: string;
  data: T;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId: string;
  details?: unknown;
}
