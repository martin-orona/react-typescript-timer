import * as React from "react";
import { render } from "react-dom";
import Timer, { TimerProps } from "./timer/Timer";

let model: TimerProps = {
  isRunning: false,
  secondsRemaining: 5
};

const App = (model: TimerProps) => (
  <React.Fragment>
    <Timer {...model} />
  </React.Fragment>
);

render(<App {...model} />, document.getElementById("root"));
