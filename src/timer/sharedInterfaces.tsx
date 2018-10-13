import * as React from "react";

export interface TimerRunningProps {
  isRunning: boolean;
}

export interface TimeKeepingProps {
  secondsRemaining: number;
}

export interface TimeUpdateProps {
  onChangeMinutes: TimeUpdateEventHandler;
  onChangeSeconds: TimeUpdateEventHandler;
}

export interface TimeUpdateEventHandler {
  (event: React.ChangeEvent<HTMLInputElement>): any;
}
export interface TimerMouseEventHandler {
  (event?: React.MouseEvent<Element>): void;
}
export interface TimerActionHandlerProps {
  onStart: TimerMouseEventHandler;
  onStop: TimerMouseEventHandler;
  onReset: TimerMouseEventHandler;
}
