import { AppState, type TimeContext } from './types';

export interface StateChange {
  from: AppState;
  to: AppState;
  atMs: number;
}

export class StateMachine {
  private current: AppState = AppState.NORMAL;

  get state(): AppState {
    return this.current;
  }

  sync(ctx: TimeContext): StateChange | null {
    if (ctx.state === this.current) {
      return null;
    }
    const change: StateChange = {
      from: this.current,
      to: ctx.state,
      atMs: ctx.nowMs
    };
    this.current = ctx.state;
    return change;
  }
}
