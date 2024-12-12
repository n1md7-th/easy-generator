import { RequestHeader } from '@common/common/enums/request.enum';
import { ConsoleLogger } from '@nestjs/common';
import { NextFunction, Response } from 'express';
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

  request.logger = new ConsoleLogger(
    `${getRequestId(request)}:${getSessionId(request)}`,
    {
      logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
      timestamp: true,
    },
  );
  next();
}

function getRequestId(request: ExpressRequest) {
  return request.get(RequestHeader.RequestId) || randomUUID();
}

function getSessionId(request: ExpressRequest) {
  return request.get(RequestHeader.SessionId) || 'No-Session-ID';
}
