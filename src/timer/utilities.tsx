export interface Time {
  minutes: number;
  seconds: number;
}

function splitTime(timeInSeconds: number): Time {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  return { minutes: minutes, seconds: seconds };
}

function joinTime(time: Time): number {
  return time.minutes * 60 + time.seconds;
}

export default { splitTime, joinTime };
