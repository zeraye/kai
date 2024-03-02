import { Move } from "chess.js";

interface AnalysisType {
  depth: number;
  evaluation: number;
  bestMove: Move | null;
}

export default AnalysisType;
