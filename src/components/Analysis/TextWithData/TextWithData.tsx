import { Typography } from "@mui/material";

interface TextWithDataProps {
  text: string;
  data: string | number;
}

const TextWithData = ({ text, data }: TextWithDataProps) => {
  return (
    <Typography variant="h4">
      {text}: {data}
    </Typography>
  );
};

export default TextWithData;
