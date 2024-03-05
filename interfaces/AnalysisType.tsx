import { Move } from "chess.js";

interface AnalysisType {
  depth: number;
  evaluation: number;
  bestMove: Move | null;
  analysedNodes: number;
  calcTimeMs: number;
}

export default AnalysisType;
