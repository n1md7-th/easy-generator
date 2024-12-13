import { AuthClaims } from '@common/common/types/auth.claims';
import { ExpressRequest } from '@common/common/types/context.type';
import {
  ConsoleLogger,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export type CtxType = {
  requestId: string;
  sessionId: string;
  startedAt: number;
  logger: ConsoleLogger;
  auth: {
    user: AuthClaims | null;
  };
};
export const Ctx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CtxType => {
    const request = ctx.switchToHttp().getRequest<ExpressRequest>();

    return {
      requestId: request.requestId,
      sessionId: request.sessionId,
      startedAt: request.startedAt,
      logger: request.logger,
      auth: request.auth,
    };
  },
);
