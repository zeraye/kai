import { Tooltip, Typography } from "@mui/material";

interface TextWithDataProps {
  text: string;
  data: string | number;
  tooltip: string;
}

const TextWithData = ({ text, data, tooltip }: TextWithDataProps) => {
  return (
    <Tooltip title={tooltip}>
      <Typography variant="h4">
        {text}: {data}
      </Typography>
    </Tooltip>
  );
};

export default TextWithData;
