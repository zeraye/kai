import { Chess, Color, Move, WHITE } from "chess.js";

import { memo, useEffect, useMemo, useState } from "react";

import AnalysisType from "../../../interfaces/AnalysisType";
import TimeLimitType from "../../../interfaces/TimeLimitType";
import Analysis from "../../components/Analysis/Analysis";
import Chessboard from "../../components/Chessboard/Chessboard";
import Timer from "../../components/Timer/Timer";

interface GameProps {
  player: Color;
}

const Game = ({ player }: GameProps) => {
  const chess = useMemo(() => new Chess(), []);
  const [analysis, setAnalysis] = useState<AnalysisType>({
    depth: 0,
    evaluation: 0,
    bestMove: null,
    analysedNodes: 0,
    calcTimeMs: 0,
  });
  const [timeLimit, setTimeLimit] = useState<TimeLimitType>({
    white: 300000,
    black: 300000,
  });
  const [lastMove, setLastMove] = useState<Move | null>(null);

  const setLastMoveHandler = (newLastMove: Move) => {
    setLastMove(newLastMove);
  };

  // Responsible for managing timer
  useEffect(() => {
    console.log(timeLimit);

    // Start timer after first move
    if (chess.history().length === 0) {
      return;
    }

    const interval = setInterval(
      () =>
        setTimeLimit((oldTimeLimit) => {
          if (chess.turn() === WHITE) {
            return { ...oldTimeLimit, white: oldTimeLimit.white - 100 };
          } else {
            return { ...oldTimeLimit, black: oldTimeLimit.black - 100 };
          }
        }),
      100,
    );

    return () => {
      clearInterval(interval);
    };
  }, [lastMove]);

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
      <Chessboard
        chess={chess}
        setAnalysis={setAnalysis}
        player={player}
        setLastMoveHandler={setLastMoveHandler}
      />
      <Timer timeLimit={timeLimit} />
    </div>
  );
};

export default Game;
