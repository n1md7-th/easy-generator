import { RequestHeader } from '@common/common/enums/request.enum';
import { AuthClaims } from '@common/common/types/auth.claims';
import { ConsoleLogger } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { ExpressRequest } from '../types/context.type';

export function authentication(
  request: ExpressRequest,
  response: Response,
  next: NextFunction,
) {
  request.requestId = getRequestId(request);
  request.sessionId = getSessionId(request);
  request.startedAt = Date.now();
  request.auth = {
    user: getUserDetails(request),
  };

  request.logger = new ConsoleLogger(
    `${getRequestId(request)}:${getSessionId(request)}`,
    {
      logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
      timestamp: true,
    },
  );
  next();
}

export function getRequestId(request: ExpressRequest) {
  return request.get(RequestHeader.RequestId) || randomUUID();
}

export function getSessionId(request: ExpressRequest) {
  return request.get(RequestHeader.SessionId) || 'No-Session-ID';
}

export function getUserDetails(request: ExpressRequest) {
  const token = request.get(RequestHeader.Authorization);

  if (!token) return null;

  const [, value] = token.split(' ', 2);

  return decode(value) as AuthClaims;
}
