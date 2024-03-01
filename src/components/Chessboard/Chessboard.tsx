import { useMeasure } from "@uidotdev/usehooks";
import { Chess, Move } from "chess.js";

import { useEffect, useState } from "react";

import PieceType from "../../../interfaces/PieceType";
import HighlightedSquare from "./HighlightedSquare/HighlightedSquare";
import Piece from "./Piece/Piece";

interface ChessboardProps {
  chess: Chess;
}

const Chessboard = ({ chess }: ChessboardProps) => {
  const [pieces, setPieces] = useState<PieceType[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
  const [possibleMovesWithSelectedPiece, setPossibleMovesWithSelectedPiece] =
    useState<Move[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chess.fen()]);

  const setSelectedPieceHandler = (newSelectedPiece: PieceType) => {
    if (selectedPiece && newSelectedPiece.square === selectedPiece.square) {
      setSelectedPiece(null);
      setPossibleMovesWithSelectedPiece([]);
      return;
    }
    setSelectedPiece(newSelectedPiece);
    setPossibleMovesWithSelectedPiece(
      chess.moves({ ...newSelectedPiece, verbose: true }),
    );
  };

  const makeMoveHandler = (move: Move) => {
    if (selectedPiece === null) {
      console.error("Cannot make move, while selected piece is null!");
      return;
    }
    chess.move(move);
    setSelectedPiece(null);
    setPossibleMovesWithSelectedPiece([]);
  };

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
        key={chess.fen()}
      >
        {pieces.map((piece) => (
          <Piece
            piece={piece}
            width={width}
            key={piece.square}
            setSelectedPieceHandler={setSelectedPieceHandler}
            selected={piece === selectedPiece}
          />
        ))}
        {possibleMovesWithSelectedPiece.map((move) => (
          <HighlightedSquare
            move={move}
            width={width}
            makeMoveHandler={makeMoveHandler}
            key={move.after}
          />
        ))}
      </div>
    </div>
  );
};

export default Chessboard;
