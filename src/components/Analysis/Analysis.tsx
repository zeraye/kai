import { Box } from "@mui/material";

import AnalysisType from "../../../interfaces/AnalysisType";
import TextWithData from "./TextWithData/TextWithData";

interface AnalysisProps {
  analysis: AnalysisType;
}

const Analysis = ({ analysis }: AnalysisProps) => {
  return (
    <Box>
      <TextWithData
        text="Depth"
        data={analysis.depth}
        tooltip="Depth searched"
      />
      <TextWithData
        text="Eval"
        data={(analysis.evaluation / 100).toFixed(2)}
        tooltip="Evaluation"
      />
      <TextWithData
        text="Best move"
        data={analysis.bestMove ? analysis.bestMove.san : "-"}
        tooltip="Best move"
      />
      <TextWithData
        text="Nodes"
        data={analysis.analysedNodes}
        tooltip="Analysed nodes"
      />
      <TextWithData
        text="Nodes per second"
        data={((1000 * analysis.analysedNodes) / analysis.calcTimeMs).toFixed(
          0,
        )}
        tooltip="Analysed nodes per second"
      />
    </Box>
  );
};

export default Analysis;
