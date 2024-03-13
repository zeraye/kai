import { Typography } from "@mui/material";

interface TextProps {
  timeLimit: number;
}

const TimerText = ({ timeLimit }: TextProps) => {
  return (
    <Typography variant="h3" align="center" padding="0.5em">
      {new Date(timeLimit).getMinutes()}:
      {new Date(timeLimit)
        .getSeconds()
        .toLocaleString("en-US", { minimumIntegerDigits: 2 })}
    </Typography>
  );
};

export default TimerText;
