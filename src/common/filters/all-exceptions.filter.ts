import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { errorResponse } from '../../utils/response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();

      // Already formatted by exceptionFactory — pass through as-is
      if (typeof raw === 'object' && raw !== null && 'success' in raw) {
        response.status(status).json(raw);
        return;
      }

      let message = exception.message;
      let errors: unknown;

      if (typeof raw === 'object' && raw !== null) {
        const body = raw as Record<string, unknown>;
        if (typeof body['message'] === 'string') {
          message = body['message'];
        }
      }

      response.status(status).json(errorResponse(message, errors));
      return;
    }

    this.logger.error(exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse('Internal server error'));
  }
}
