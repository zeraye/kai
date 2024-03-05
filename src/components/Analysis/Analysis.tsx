import AnalysisType from "../../../interfaces/AnalysisType";

interface AnalysisProps {
  analysis: AnalysisType;
}

const Analysis = ({ analysis }: AnalysisProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div>
        <h3>Depth searched: {analysis.depth}</h3>
        <h3>Evaluation: {(analysis.evaluation / 100).toFixed(2)}</h3>
        <h3>Best move: {analysis.bestMove ? analysis.bestMove.san : "-"}</h3>
        <h3>Analysed nodes: {analysis.analysedNodes}</h3>
        <h3>
          Analysed nodes per second:{" "}
          {(analysis.analysedNodes / (analysis.calcTimeMs / 1000)).toFixed(0)}
        </h3>
      </div>
    </div>
  );
};

export default Analysis;
