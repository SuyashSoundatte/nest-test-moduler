import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseException } from './base.exception';
import { ErrorResponse } from './error.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment =
      this.configService.get('NODE_ENV') === 'development';
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse;

    if (exception instanceof BaseException) {
      statusCode = exception.getStatus();
      errorResponse = exception.getResponse() as ErrorResponse;
    } else {
      errorResponse = this.handleUnknownException(exception);
    }

    this.logError(exception, request, statusCode);

    response.status(statusCode).send(errorResponse);
  }

  /* ───────────── UNKNOWN ERROR ───────────── */

  private handleUnknownException(exception: unknown): ErrorResponse {
    const errorId = this.generateErrorId();

    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        errorId,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /* ───────────── LOGGING ───────────── */

  private logError(
    exception: unknown,
    request: FastifyRequest,
    statusCode: number,
  ) {
    const logPayload = {
      requestId: request.headers['x-request-id'],
      method: request.method,
      url: request.url,
      ip: request.ip,
      statusCode,
    };

    if (exception instanceof Error) {
      this.logger.error(
        {
          ...logPayload,
          message: exception.message,
          stack: this.isDevelopment ? exception.stack : undefined,
        },
        'Unhandled exception',
      );
    } else {
      this.logger.error(
        {
          ...logPayload,
          exception,
        },
        'Unknown thrown value',
      );
    }
  }

  private generateErrorId(): string {
    return `ERR-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
