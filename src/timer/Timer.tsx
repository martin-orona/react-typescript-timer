import * as React from "react";
import Header from "./Header";
import Actions from "./Actions";
import TimeDisplay from "./TimeDisplay";
import {
  TimerRunningProps,
  TimeKeepingProps,
  TimerActionHandlerProps,
  TimerMouseEventHandler,
  TimeUpdateProps,
  TimeUpdateEventHandler
} from "./sharedInterfaces";
import TimeUtes, { Time } from "./utilities";
import "./timer.css";

export interface TimerProps extends TimerRunningProps, TimeKeepingProps {}
interface TimerState extends TimerProps {}

class Timer extends React.Component<TimerProps, TimerState> {
  state: Readonly<TimerState>;

  private _logic: TimerLogic;

  constructor(props: TimerProps) {
    super(props);
    this.state = { ...props };
    this._logic = new TimerLogic(
      this,
      (changer: StateChangeRequest, callback?: (state: TimerState) => void) => {
        this.setState(
          (prev, props) => changer(prev, props),
          () => callback && callback(this.state)
        );
      }
    );
  }

  public render() {
    return (
      <div className="timer">
        <Header />
        <TimeDisplay {...this.state} {...this._logic} />
        <Actions {...this.state} {...this._logic} />
      </div>
    );
  }
}

interface StateChanger {
  (
    state:
      | TimerState
      | ((
          prevState: Readonly<TimerState>,
          props: Readonly<TimerProps>
        ) => TimerState | Pick<TimerState, never> | null)
      | Pick<TimerState, never>
      | null,
    callback?: ((state: TimerState) => void) | undefined
  ): void;
  /* NOTE: The definition for the callback is a function that takes no arguments.
     I'm adding the current state so that the callback knows for sure what changes
     have taken place. */
}

interface StateChangeRequest {
  (prevState: Readonly<TimerState>, props: Readonly<TimerProps>):
    | TimerState
    | Pick<TimerState, never>
    | null;
}

class TimerLogic implements TimerActionHandlerProps, TimeUpdateProps {
  // #region TimerActionHandlerProps
  onStart: TimerMouseEventHandler = this.startTimer;
  onStop: TimerMouseEventHandler = this.stopTimer;
  onReset: TimerMouseEventHandler = this.resetTimer;
  // #endregion TimerActionHandlerProps

  // #region TimeUpdateProps
  onChangeMinutes: TimeUpdateEventHandler = this.setMinutes;
  onChangeSeconds: TimeUpdateEventHandler = this.setSeconds;
  // #endregion TimeUpdateProps

  // NOTE: this.timerTick() is private and cannot be accessed
  // from inside setInterval(). Setting this private variable
  // allows access to this.timerTick(), akin to calling bind() on it.
  private onTick: () => void = this.timerTick;

  private _timer: Timer;
  private _setState: StateChanger;

  constructor(timer: Timer, stateChanger: StateChanger) {
    this._timer = timer;
    this._setState = stateChanger;
  }

  // #region TimerActionHandlerProps
  private startTimer(event: React.MouseEvent): void {
    if (this._timer.state.isRunning) {
      return;
    }

    if (this._timer.state.secondsRemaining <= 0) {
      return;
    }

    this._setState(
      (prev: any) => {
        return { isRunning: true };
      },
      state => {
        const runTimer = () => {
          let jsTimerId: number;

          jsTimerId = window.setInterval(() => {
            if (!this._timer.state.isRunning) {
              window.clearInterval(jsTimerId);
            } else {
              this.onTick();
            }
          }, 1000);
        };
        runTimer();
      }
    );
  }

  private stopTimer(event?: React.MouseEvent): void {
    this._setState((prev: any) => {
      return { isRunning: false };
    });
  }

  private resetTimer(event?: React.MouseEvent): void {
    this._setState((prev: any) => {
      return { isRunning: false, secondsRemaining: 0 };
    });
  }

  private timerTick(): void {
    let state = this._timer.state;
    if (!state.isRunning) {
      return;
    }

    if (state.secondsRemaining <= 0) {
      this.onReset();
      return;
    }

    this._setState((prev: TimerState) => {
      return { secondsRemaining: prev.secondsRemaining - 1 };
    });
  }
  // #endregion TimerActionHandlerProps

  // #region TimeUpdateProps
  private setMinutes(event: React.ChangeEvent<HTMLInputElement>): any {
    event.preventDefault();
    let parsed = parseInt(event.target.value);
    if (isNaN(parsed)) {
      return;
    }

    this._setState(prev => {
      let time: Time = TimeUtes.splitTime(prev.secondsRemaining);
      time.minutes = parsed;
      let remaining = TimeUtes.joinTime(time);

      return { secondsRemaining: remaining };
    });
  }

  private setSeconds(event: React.ChangeEvent<HTMLInputElement>): any {
    event.preventDefault();
    let parsed = parseInt(event.target.value);
    if (isNaN(parsed)) {
      return;
    }

    this._setState(prev => {
      let time = TimeUtes.splitTime(prev.secondsRemaining);
      time.seconds = parsed;
      let remaining = TimeUtes.joinTime(time);

      return { secondsRemaining: remaining };
    });
  }
  // #endregion TimeUpdateProps
}

export default Timer;
