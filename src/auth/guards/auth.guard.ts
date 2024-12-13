import { ExpressRequest } from '@common/common/types/context.type';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { env } from 'node:process';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const authorization = request.header('Authorization');
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = this.extractAuthorization(authorization);

    if (type !== 'Bearer') {
      throw new UnauthorizedException(`Invalid token type: ${type}`);
    }

    try {
      verify(token, env.JWT_SECRET);
    } catch (exception: unknown) {
      throw new UnauthorizedException(this.getMessage(exception));
    }

    return true;
  }

  private extractAuthorization(authorization: string) {
    return authorization.split(' ', 2);
  }

  private getMessage(exception: unknown) {
    return exception instanceof Error ? exception.message : 'Invalid token';
  }
}
