import * as React from "react";
import {
  TimerRunningProps,
  TimeKeepingProps,
  TimerActionHandlerProps
} from "./sharedInterfaces";

export interface ActionProps
  extends TimerRunningProps,
    TimeKeepingProps,
    TimerActionHandlerProps {}

let Actions = (props: ActionProps) => {
  var primary: JSX.Element;
  if (!props.isRunning) {
    primary = (
      <button
        onClick={event => props.onStart(event)}
        disabled={props.secondsRemaining <= 0}
      >
        Start
      </button>
    );
  } else {
    primary = <button onClick={event => props.onStop(event)}>Stop</button>;
  }

  return (
    <div className="actions">
      {primary}
      <button onClick={event => props.onReset(event)}>Reset</button>
    </div>
  );
};

export default Actions;
