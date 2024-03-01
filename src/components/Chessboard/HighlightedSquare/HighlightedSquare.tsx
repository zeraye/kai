import { Move } from "chess.js";

import { useMemo } from "react";

interface PieceProps {
  move: Move;
  width: number | null;
  makeMoveHandler: (move: Move) => void;
}

const HighlightedSquare = ({ move, width, makeMoveHandler }: PieceProps) => {
  const row = useMemo(() => 8 - parseInt(move.to[1]), [move.to]);
  const col = useMemo(
    () => move.to.charCodeAt(0) - "a".charCodeAt(0),
    [move.to],
  );

  return (
    <div
      style={{
        height: `calc(0.125*${width}px)`,
        width: `calc(0.125*${width}px)`,
        transform: `translate(${col * 100}%, ${row * 100}%)`,
        position: "absolute",
      }}
      onClick={() => makeMoveHandler(move)}
    >
      <div
        style={{
          height: `calc(0.05*${width}px)`,
          width: `calc(0.05*${width}px)`,
          transform: `translate(75%, 75%)`,
          backgroundColor: "rgba(0, 0, 0, 0.14)",
          borderRadius: `${width}px`,
        }}
      ></div>
    </div>
  );
};

export default HighlightedSquare;
