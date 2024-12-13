import { Inject, Injectable, Optional } from '@nestjs/common';
import { TimerParams } from '../enums/timer.enum';

export type TimerCb = () => void;
type TimerId = ReturnType<typeof setInterval>;
type StartParams = {
  runImmediately: boolean;
};

@Injectable()
export class TimerService {
  private callback?: TimerCb;
  private nextTick?: number;
  private timerId?: TimerId;

  constructor(@Optional() @Inject(TimerParams.NextTick) nextTick = 60 * 1000) {
    this.nextTick = nextTick;
  }

  /**
   * @description Schedule a callback to be executed every `nextTick` milliseconds
   *
   * @param {Boolean} params.initialRun - If true, the callback will be executed immediately
   */
  start(params?: StartParams) {
    this.validate();
    this.scheduleCallback();

    if (params?.runImmediately) this.executeCallback();
  }

  resume() {
    this.start();
  }

  stop() {
    this.clearTimer();
  }

  setCallback(callback: TimerCb) {
    this.callback = callback;

    return this;
  }

  /**
   * @param {number} nextTick - Time in milliseconds
   */
  setNextTick(nextTick: number) {
    this.clearTimer();
    this.nextTick = nextTick;

    return this;
  }

  private executeCallback() {
    if (this.callback) this.callback();
  }

  private scheduleCallback() {
    this.clearTimer();

    if (this.nextTick) {
      this.timerId = setInterval(() => {
        this.executeCallback();
      }, this.nextTick);
    }
  }

  private clearTimer() {
    if (this.timerId) clearInterval(this.timerId);
  }

  private validate() {
    if (!this.nextTick) throw new Error('Next tick is not set');
    if (!this.callback) throw new Error('Callback is not set');
  }
}
