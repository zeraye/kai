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
        <h2>Depth searched: {analysis.depth}</h2>
        <h2>Evaluation: {(analysis.evaluation / 100).toFixed(2)}</h2>
        <h2>Best move: {analysis.bestMove ? analysis.bestMove.san : "-"}</h2>
      </div>
    </div>
  );
};

export default Analysis;
