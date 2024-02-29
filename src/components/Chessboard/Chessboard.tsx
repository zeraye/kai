import { useMeasure } from "@uidotdev/usehooks";
import { Chess } from "chess.js";

import { useEffect, useState } from "react";

import PieceType from "../../../interfaces/PieceType";
import Piece from "./Piece/Piece";

interface ChessboardProps {
  chess: Chess;
}

const Chessboard = ({ chess }: ChessboardProps) => {
  const [pieces, setPieces] = useState<PieceType[]>([]);

  const [ref, { width }] = useMeasure();

  useEffect(() => {
    const newPieces: PieceType[] = [];
    const board = chess.board();
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        const piece = board[i][j];
        if (piece !== null) {
          newPieces.push(piece);
        }
      }
    }
    setPieces(newPieces);
  }, [chess]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          backgroundImage: `url(./assets/images/chessboard.png)`,
          backgroundSize: "100%",
          maxHeight: "100vh",
          aspectRatio: 1,
          margin: "auto",
        }}
      >
        {pieces.map((piece) => (
          <Piece piece={piece} width={width} key={piece.square} />
        ))}
      </div>
    </div>
  );
};

export default Chessboard;
