import { Box, Divider } from "@mui/material";

import TimeLimitType from "../../../interfaces/TimeLimitType";
import TimerText from "./TimerText/TimerText";

interface TimerProps {
  timeLimit: TimeLimitType;
}

const Timer = ({ timeLimit }: TimerProps) => {
  return (
    <Box
      style={{
        padding: "3em",
      }}
    >
      <TimerText timeLimit={timeLimit.black} />
      <Divider />
      <TimerText timeLimit={timeLimit.white} />
    </Box>
  );
};

export default Timer;
