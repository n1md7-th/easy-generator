import { ExpressRequest } from '@common/common/types/context.type';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) throw error;

        const message = this.getMessage(error);
        const statusCode = this.getStatusCode(error);
        const cause = this.getCause(error);

        request.logger.error(
          JSON.stringify({ message, statusCode, cause }, null, 2),
        );

        throw new HttpException(
          {
            statusCode,
            message,
            cause,
          },
          statusCode,
        );
      }),
    );
  }

  private getStatusCode(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown) {
    switch (true) {
      case exception instanceof Error:
      case exception instanceof HttpException:
        return exception.message;
      default:
        return 'Unknown error';
    }
  }

  private getCause(exception: unknown) {
    switch (true) {
      case exception instanceof HttpException:
        return exception.cause;
      default:
        return '';
    }
  }
}
