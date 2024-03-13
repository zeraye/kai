import { Box } from "@mui/material";

import AnalysisType from "../../../interfaces/AnalysisType";
import TextWithData from "./TextWithData/TextWithData";

interface AnalysisProps {
  analysis: AnalysisType;
}

const Analysis = ({ analysis }: AnalysisProps) => {
  return (
    <Box>
      <TextWithData text="Depth searched" data={analysis.depth} />
      <TextWithData
        text="Evaluation"
        data={(analysis.evaluation / 100).toFixed(2)}
      />
      <TextWithData
        text="Best move"
        data={analysis.bestMove ? analysis.bestMove.san : "-"}
      />
      <TextWithData text="Analysed nodes" data={analysis.analysedNodes} />
      <TextWithData
        text="Analysed nodes per second"
        data={((1000 * analysis.analysedNodes) / analysis.calcTimeMs).toFixed(
          0,
        )}
      />
    </Box>
  );
};

export default Analysis;
