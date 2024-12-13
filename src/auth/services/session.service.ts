import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Session } from '../classes/session.class';
import { TimerService } from './timer.service';

@Injectable()
export class SessionService implements OnModuleInit, OnModuleDestroy {
  private readonly sessions: Map<string, Session>;

  constructor(private readonly timer: TimerService) {
    this.sessions = new Map();
    this.timer.setCallback(this.checkSessions.bind(this));
  }

  onModuleInit() {
    this.timer.start({ runImmediately: true });
  }

  onModuleDestroy() {
    this.timer.stop();
  }

  async create(id: string, user: unknown, expiresAt: Date) {
    this.sessions.set(id, new Session(expiresAt, user));
  }

  async get(id: string) {
    return this.sessions.get(id);
  }

  async delete(id: string) {
    this.sessions.delete(id);
  }

  private checkSessions() {
    this.sessions.forEach((session, id) => {
      if (session.isExpired()) {
        this.sessions.delete(id);
      }
    });
  }
}
