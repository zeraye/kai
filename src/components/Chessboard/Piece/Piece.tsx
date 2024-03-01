import { useMemo } from "react";

import PieceType from "../../../../interfaces/PieceType";

interface PieceProps {
  piece: PieceType;
  width: number | null;
  setSelectedPieceHandler: (newSelectedPiece: PieceType) => void;
  selected: boolean;
}

const Piece = ({
  piece,
  width,
  setSelectedPieceHandler,
  selected,
}: PieceProps) => {
  const row = useMemo(() => 8 - parseInt(piece.square[1]), [piece.square]);
  const col = useMemo(
    () => piece.square.charCodeAt(0) - "a".charCodeAt(0),
    [piece.square],
  );
  const isLightSquare = useMemo(() => row % 2 === col % 2, [row, col]);

  return (
    <div
      style={{
        backgroundImage: `url("./assets/images/pieces/${piece.color}${piece.type}.png")`,
        backgroundSize: "100%",
        height: `calc(0.125*${width}px)`,
        width: `calc(0.125*${width}px)`,
        transform: `translate(${col * 100}%, ${row * 100}%)`,
        userSelect: "none",
        position: "absolute",
        backgroundColor: selected
          ? isLightSquare
            ? "#f5f580"
            : "#b9ca42"
          : "",
      }}
      onClick={() => setSelectedPieceHandler(piece)}
    ></div>
  );
};

export default Piece;
