import { useMeasure } from "@uidotdev/usehooks";
import { BLACK, Chess, Color, Move, WHITE } from "chess.js";

import { useEffect, useState } from "react";

import AnalysisType from "../../../interfaces/AnalysisType";
import { HeuristicsType } from "../../../interfaces/HeuristicsType";
import PieceType from "../../../interfaces/PieceType";
import HighlightedSquare from "./HighlightedSquare/HighlightedSquare";
import Piece from "./Piece/Piece";

interface ChessboardProps {
  chess: Chess;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisType>>;
  player: Color;
  setLastMoveHandler: (newLastMove: Move) => void;
  heuristics: HeuristicsType;
}

const Chessboard = ({
  chess,
  setAnalysis,
  player,
  setLastMoveHandler,
  heuristics,
}: ChessboardProps) => {
  const [pieces, setPieces] = useState<PieceType[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
  const [possibleMovesWithSelectedPiece, setPossibleMovesWithSelectedPiece] =
    useState<Move[]>([]);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [blockSelecting, setBlockSelecting] = useState(player !== WHITE);

  const [ref, { width }] = useMeasure();

  useEffect(() => {
    // minimax worker
    const mmWorker = new Worker(
      new URL("../../workers/minimax.ts", import.meta.url),
      { type: "module" },
    );
    mmWorker.onmessage = (event) => {
      if ("depth" in event.data) {
        setAnalysis({
          depth: event.data.depth,
          evaluation: event.data.evaluation,
          bestMove: event.data.bestMove,
          analysedNodes: event.data.analysedNodes,
          calcTimeMs: event.data.calcTimeMs,
        });
      } else {
        chess.move(event.data.bestMove);
        setLastMoveHandler(event.data.bestMove);
        setBlockSelecting(false);
      }
    };

    if (player === BLACK) {
      mmWorker.postMessage({ fen: chess.fen(), heuristics: heuristics });
    }

    setWorker(mmWorker);

    return () => {
      mmWorker.terminate();
    };
  }, [chess, setAnalysis]);

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
  }, [chess.fen(), blockSelecting]);

  const setSelectedPieceHandler = (newSelectedPiece: PieceType) => {
    if (selectedPiece && newSelectedPiece.square === selectedPiece.square) {
      setSelectedPiece(null);
      setPossibleMovesWithSelectedPiece([]);
      return;
    }
    if (blockSelecting) {
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
    if (worker === null) {
      console.error("Cannot make move, while worker is null!");
      return;
    }
    chess.move(move);
    setLastMoveHandler(move);
    setSelectedPiece(null);
    setPossibleMovesWithSelectedPiece([]);
    setBlockSelecting(true);
    worker.postMessage({ fen: chess.fen(), heuristics: heuristics });
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
