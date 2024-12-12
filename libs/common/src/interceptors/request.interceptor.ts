import { Env } from '@common/common/env/env.static';
import { ExpressRequest } from '@common/common/types/context.type';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();

    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const response = context.switchToHttp().getResponse();

    const whiteListedPaths = ['health', 'docs', 'swagger-ui'];
    const isWhiteListed = whiteListedPaths.some((path) =>
      request.url.includes(path),
    );

    const text = {
      started: 'Started',
      completed: 'Completed',
      payload: 'Payload',
    };

    const { ip, method, originalUrl } = request;
    const userAgent = Env.isDevelopment()
      ? 'User-agent-omitted'
      : request.get('User-Agent');

    response.on('finish', () => {
      const ended = Date.now();
      const delta = ended - started;
      const { statusCode: code } = response;

      if (!isWhiteListed) {
        request.logger.log(
          `${text.completed} ${method} ${code} in ${delta}ms ${originalUrl} - ${userAgent} ${ip}`,
        );
      }
    });

    if (!isWhiteListed) {
      request.logger.log(
        `${text.started} ${method} ${originalUrl} - ${userAgent} ${ip}`,
      );
      request.logger.log(
        `${text.payload} ${JSON.stringify(request.body, null, 2)}`,
      );
    }

    return next.handle();
  }
}
