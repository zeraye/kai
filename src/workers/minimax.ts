import { Chess, Color, Move, PieceSymbol, WHITE } from "chess.js";

import { HeuristicsType } from "../../interfaces/HeuristicsType";

const MAX_DEPTH = 99;
const TIME_LIMIT_MS = 3000;

const pawnSquareTable = [
  0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
  20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10,
  0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
];

const knightSquareTable = [
  -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
  0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20,
  15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const bishopSquareTable = [
  -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0,
  -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10,
  -10, -10, -10, -10, -10, -20,
];

const rookSquareTable = [
  0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
];

const queenSquareTable = [
  -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5,
  5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10,
  -20,
];

const kingMiddleGameSquareTable = [
  -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
  -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
  -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
  -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
];

const kingEndGameSquareTable = [
  -50, -40, -30, -20, -20, -30, -40, -50, -30, -20, -10, 0, 0, -10, -20, -30,
  -30, -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30,
  -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30,
  0, 0, 0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50,
];

const squareTableEval = (
  piece: PieceSymbol,
  color: Color,
  squareNumber: number,
  isEndGame: boolean,
) => {
  let color_inv = -1.0; // black

  if (color == WHITE) {
    squareNumber = 63 - squareNumber; // reverse squareTable, 63 is MAX_SQUARE_TABLE_INDEX
    color_inv = 1.0;
  }

  switch (piece) {
    case "p":
      return pawnSquareTable[squareNumber] * color_inv;
    case "n":
      return knightSquareTable[squareNumber] * color_inv;
    case "b":
      return bishopSquareTable[squareNumber] * color_inv;
    case "r":
      return rookSquareTable[squareNumber] * color_inv;
    case "q":
      return queenSquareTable[squareNumber] * color_inv;
    case "k":
      if (isEndGame) {
        return kingEndGameSquareTable[squareNumber] * color_inv;
      }
      return kingMiddleGameSquareTable[squareNumber] * color_inv;
    default:
      return 0;
  }
};

const checkEndGame = (chess: Chess) => chess.moveNumber() > 50;

const pieceToValue: { [type in PieceSymbol]: number } = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const complexEvalPosition = (chess: Chess): number => {
  if (chess.isGameOver()) {
    if (chess.isDraw()) {
      return 0;
    }
    if (chess.turn() === "w") {
      return -Infinity;
    } else {
      return Infinity;
    }
  }

  let bestEval = 0;

  const isEndGame = checkEndGame(chess);
  const board = chess.board();
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      const piece = board[i][j];
      if (!piece) {
        continue;
      }
      bestEval += pieceToValue[piece.type] * (piece.color === "w" ? 1 : -1);
      bestEval += squareTableEval(
        piece.type,
        piece.color,
        i * 8 + j,
        isEndGame,
      );
    }
  }

  return bestEval;
};

const simpleEvalPosition = (chess: Chess): number => {
  if (chess.isGameOver()) {
    if (chess.isDraw()) {
      return 0;
    }
    if (chess.turn() === "w") {
      return -Infinity;
    } else {
      return Infinity;
    }
  }

  let bestEval = 0;

  const board = chess.board();
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      const piece = board[i][j];
      if (!piece) {
        continue;
      }
      bestEval += piece.color === "w" ? 1 : -1;
    }
  }

  return bestEval;
};

const evalPosition = (chess: Chess, heuristics: HeuristicsType): number => {
  if (heuristics === "simple") {
    return simpleEvalPosition(chess);
  }
  return complexEvalPosition(chess);
};

const CalcMiniMaxRecursive = (
  chess: Chess,
  alpha: number,
  beta: number,
  depth: number,
  isMax: boolean,
  start: number,
  analyse: {
    analysedNodes: number;
  },
  heuristics: HeuristicsType,
): number => {
  if (Date.now() - start > TIME_LIMIT_MS)
    throw new Error("Time limit exceeded");

  analyse.analysedNodes++;

  if (chess.isGameOver() || depth === 0) {
    return evalPosition(chess, heuristics);
  }

  let bestEval = Infinity * (!isMax ? 1 : -1);

  chess.moves().some((move) => {
    const chessCopy = new Chess(chess.fen());
    chessCopy.move(move);

    const newEval = CalcMiniMaxRecursive(
      chessCopy,
      alpha,
      beta,
      depth - 1,
      !isMax,
      start,
      analyse,
      heuristics,
    );

    if (isMax) {
      bestEval = Math.max(newEval, bestEval);
      alpha = Math.max(bestEval, alpha);
    } else {
      bestEval = Math.min(newEval, bestEval);
      beta = Math.min(bestEval, beta);
    }

    if (beta <= alpha) {
      return true;
    }
  });

  return bestEval;
};

const CalcMiniMax = (
  chess: Chess,
  depth: number,
  start: number,
  analyse: {
    analysedNodes: number;
  },
  heuristics: HeuristicsType,
): [Move | null, number] => {
  const isMax = chess.turn() === "w";

  const alpha = -Infinity;
  const beta = Infinity;

  let bestMoves: Move[] = [];
  let bestEval = Infinity * (isMax ? -1 : 1);

  chess.moves({ verbose: true }).forEach((move) => {
    const chessCopy = new Chess(chess.fen());
    chessCopy.move(move);

    const newEval = CalcMiniMaxRecursive(
      chessCopy,
      alpha,
      beta,
      depth,
      !isMax,
      start,
      analyse,
      heuristics,
    );

    if ((newEval > bestEval && isMax) || (newEval < bestEval && !isMax)) {
      bestMoves = [move];
      bestEval = newEval;
    } else if (newEval === bestEval) {
      bestMoves.push(move);
    }
  });

  const bestMove =
    bestMoves.length > 0
      ? bestMoves[Math.floor(Math.random() * bestMoves.length)]
      : null;

  return [bestMove, bestEval];
};

const MakeMoveMiniMax = (chess: Chess, heuristics: HeuristicsType) => {
  let bestMove: Move | null = null;
  let bestEval: number | null = null;

  const start = Date.now();

  let minimaxError: unknown | null = null;

  const analyse = {
    analysedNodes: 0,
  };

  for (let depth = 1; depth <= MAX_DEPTH; ++depth) {
    try {
      [bestMove, bestEval] = CalcMiniMax(
        chess,
        depth,
        start,
        analyse,
        heuristics,
      );
      postMessage({
        depth: depth,
        evaluation: bestEval,
        bestMove: bestMove,
        analysedNodes: analyse.analysedNodes,
        calcTimeMs: Date.now() - start,
      });
    } catch (error) {
      minimaxError = error;
      break;
    }
  }

  if (bestMove === null || bestEval === null) {
    console.error(`Error in minimax: ${minimaxError}. Making random move...`);
    const moves = chess.moves({ verbose: true });
    bestMove = moves[Math.floor(Math.random() * moves.length)];
    bestEval = 0;
  }

  // Message without depth means end of calculation
  postMessage({
    evaluation: bestEval,
    bestMove: bestMove,
  });
};

onmessage = function (event) {
  const fen = event.data.fen;
  const heuristics = event.data.heuristics;
  MakeMoveMiniMax(new Chess(fen), heuristics);
};
