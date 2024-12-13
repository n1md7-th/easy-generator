import { AuthClaims } from '@common/common/types/auth.claims';
import { ConsoleLogger } from '@nestjs/common';
import { Request } from 'express';

export type ExpressRequest = Request & {
  startedAt: number;
  logger: ConsoleLogger;
  requestId: string;
  sessionId: string;
  auth: {
    user: AuthClaims | null;
  };
};
