import * as React from "react";
import {
  TimerRunningProps,
  TimeKeepingProps,
  TimeUpdateProps
} from "./sharedInterfaces";
import TimeUtes, { Time } from "./utilities";

export interface TimeDisplayProps
  extends TimerRunningProps,
    TimeKeepingProps,
    TimeUpdateProps {}

const TimeDisplay = (props: TimeDisplayProps) => {
  var time: Time = TimeUtes.splitTime(props.secondsRemaining);

  return (
    <div className="time-display">
      {props.isRunning ? displayReadonly(time) : displayEditable(time, props)}
    </div>
  );
};

function displayReadonly(time: Time) {
  return (
    <div className="read-only">
      {format(time.minutes)} : {format(time.seconds)}
    </div>
  );
}

function displayEditable(time: Time, props: TimeDisplayProps) {
  return (
    <React.Fragment>
      <input
        type="text"
        value={format(time.minutes)}
        onChange={event => props.onChangeMinutes(event)}
      />
      <label>:</label>
      <input
        type="text"
        value={format(time.seconds)}
        onChange={event => props.onChangeSeconds(event)}
      />
    </React.Fragment>
  );
}

function format(value: number): string {
  return (value < 10 ? "0" : "") + value.toString();
}

export default TimeDisplay;
