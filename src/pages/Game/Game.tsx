import { Box, Button, ButtonGroup, Modal, Typography } from "@mui/material";
import { Chess, Color, Move, WHITE } from "chess.js";

import { useEffect, useState } from "react";

import AnalysisType from "../../../interfaces/AnalysisType";
import { PageType } from "../../../interfaces/PageType";
import TimeLimitType from "../../../interfaces/TimeLimitType";
import Analysis from "../../components/Analysis/Analysis";
import Chessboard from "../../components/Chessboard/Chessboard";
import Timer from "../../components/Timer/Timer";

const defaultTimeLimit = {
  white: 300000,
  black: 300000,
};

const defaultEmptyAnalysis = {
  depth: 0,
  evaluation: 0,
  bestMove: null,
  analysedNodes: 0,
  calcTimeMs: 0,
};

interface GameProps {
  player: Color;
  setPageHandler: (newPage: PageType) => void;
}

const Game = ({ player, setPageHandler }: GameProps) => {
  const [chess, setChess] = useState(
    new Chess("8/pp6/8/2k1K2P/8/8/1p6/8 w - - 0 42"),
  );
  const [analysis, setAnalysis] = useState<AnalysisType>(defaultEmptyAnalysis);
  const [timeLimit, setTimeLimit] = useState<TimeLimitType>(defaultTimeLimit);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState<"WHITE" | "BLACK" | null>(null);

  const setLastMoveHandler = (newLastMove: Move) => {
    setLastMove(newLastMove);
  };

  // Responsible for managing timer
  useEffect(() => {
    // Start timer after first move
    if (chess.history().length === 0) {
      return;
    }

    if (open) {
      return;
    }

    const interval = setInterval(
      () =>
        setTimeLimit((oldTimeLimit) => {
          if (chess.turn() === WHITE) {
            if (oldTimeLimit.white - 100 <= 0) {
              setWinner("BLACK");
              setOpen(true);
              return { ...oldTimeLimit, white: 0 };
            }
            return { ...oldTimeLimit, white: oldTimeLimit.white - 100 };
          } else {
            if (oldTimeLimit.black - 100 <= 0) {
              setWinner("WHITE");
              setOpen(true);
              return { ...oldTimeLimit, black: 0 };
            }
            return { ...oldTimeLimit, black: oldTimeLimit.black - 100 };
          }
        }),
      100,
    );

    return () => {
      clearInterval(interval);
    };
  }, [open, chess, lastMove]);

  useEffect(() => {
    if (chess.isGameOver()) {
      if (chess.isDraw()) {
        setWinner(null);
        setOpen(true);
        return;
      }
      if (chess.turn() === "w") {
        setWinner("BLACK");
        setOpen(true);
        return;
      } else {
        setWinner("WHITE");
        setOpen(true);
        return;
      }
    }
  }, [chess, lastMove]);

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
      <Button onClick={() => setOpen(true)}>Resign</Button>
      <Modal open={open}>
        <Box
          sx={{
            display: "grid",
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h4">
            {winner === "WHITE"
              ? "White have won the game!"
              : winner === "BLACK"
                ? "Black have won the game!"
                : "Game ended in draw!"}
          </Typography>
          <ButtonGroup
            style={{
              margin: "auto",
            }}
          >
            <Button
              onClick={() => {
                setTimeLimit(defaultTimeLimit);
                setAnalysis(defaultEmptyAnalysis);
                setChess(new Chess());
                setOpen(false);
              }}
            >
              Play again
            </Button>
            <Button onClick={() => setPageHandler("Menu")}>Go to menu</Button>
          </ButtonGroup>
        </Box>
      </Modal>
    </div>
  );
};

export default Game;
