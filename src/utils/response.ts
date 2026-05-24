export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export function successResponse<T>(
  message: string,
  data?: T,
): SuccessResponse<T> {
  const response: SuccessResponse<T> = { success: true, message };
  if (data !== undefined) response.data = data;
  return response;
}

export function errorResponse(
  message: string,
  errors?: unknown,
): ErrorResponse {
  const response: ErrorResponse = { success: false, message };
  if (errors !== undefined) response.errors = errors;
  return response;
}
