import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`${method} ${url} - ${duration}ms`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        
        this.logger.error({
          message: 'Request failed',
          method,
          url,
          duration,
          body,
          error: error.message,
          stack: error.stack,
        });

        return throwError(() => error);
      }),
    );
  }
}