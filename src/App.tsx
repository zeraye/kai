import { Chess } from "chess.js";

import { useMemo, useState } from "react";

import AnalysisType from "../interfaces/AnalysisType";
import Analysis from "./components/Analysis/Analysis";
import Chessboard from "./components/Chessboard/Chessboard";
import Timer from "./components/Timer/Timer";

const App = () => {
  const chess = useMemo(() => new Chess(), []);
  const [analysis, setAnalysis] = useState<AnalysisType>({
    depth: 0,
    evaluation: 0,
    bestMove: null,
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(20%, max-content) auto minmax(20%, max-content)",
        alignItems: "center",
      }}
    >
      <Analysis analysis={analysis} />
      <Chessboard chess={chess} setAnalysis={setAnalysis} />
      <Timer />
    </div>
  );
};

export default App;
