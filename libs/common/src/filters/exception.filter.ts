import { ExpressRequest } from '@common/common/types/context.type';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<ExpressRequest>();
    const response = ctx.getResponse<Response>();

    return response
      .status(exception.getStatus())
      .json(this.getResponseBody(exception));
  }

  private getResponseBody(exception: HttpException) {
    const responseBody = exception.getResponse();

    if (this.isObject(responseBody)) {
      return {
        message: responseBody.message || exception.message,
        statusCode: responseBody.statusCode || exception.getStatus(),
        cause: responseBody.cause || exception.cause,
      };
    }

    return {
      message: exception.message + '; ' + exception.getResponse(),
      statusCode: exception.getStatus(),
      cause: exception.cause,
    };
  }

  private isObject(
    value: unknown,
  ): value is { message: string; statusCode: number; cause: string } {
    return typeof value !== null && typeof value === 'object';
  }
}
