import TimeLimitType from "../../../interfaces/TimeLimitType";

interface TimerProps {
  timeLimit: TimeLimitType;
}

const Timer = ({ timeLimit }: TimerProps) => {
  return (
    <div style={{ textAlign: "center", padding: "3em" }}>
      <h1>{`${new Date(timeLimit.black).getMinutes()}:${new Date(timeLimit.black).getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2 })}`}</h1>
      <hr />
      <h1>{`${new Date(timeLimit.white).getMinutes()}:${new Date(timeLimit.white).getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2 })}`}</h1>
    </div>
  );
};

export default Timer;
