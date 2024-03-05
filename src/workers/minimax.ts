import { Chess, Move, PieceSymbol } from "chess.js";

const MAX_DEPTH = 99;
const TIME_LIMIT_MS = 5000;

const pieceToValue: { [type in PieceSymbol]: number } = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 10000,
};

const evalPosition = (chess: Chess): number => {
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
      bestEval += pieceToValue[piece.type] * (piece.color === "w" ? 1 : -1);
    }
  }

  return bestEval;
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
): number => {
  if (Date.now() - start > TIME_LIMIT_MS)
    throw new Error("Time limit exceeded");

  analyse.analysedNodes++;

  if (chess.isGameOver() || depth === 0) {
    return evalPosition(chess);
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
): [Move | null, number] => {
  const isMax = chess.turn() === "w";

  const alpha = -Infinity;
  const beta = Infinity;

  let bestMove: Move | null = null;
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
    );

    if ((newEval > bestEval && isMax) || (newEval < bestEval && !isMax)) {
      bestMove = move;
      bestEval = newEval;
    }
  });

  return [bestMove, bestEval];
};

const MakeMoveMiniMax = (chess: Chess) => {
  let bestMove: Move | null = null;
  let bestEval: number | null = null;

  const start = Date.now();

  let minimaxError: unknown | null = null;

  const analyse = {
    analysedNodes: 0,
  };

  for (let depth = 1; depth <= MAX_DEPTH; ++depth) {
    try {
      [bestMove, bestEval] = CalcMiniMax(chess, depth, start, analyse);
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
  MakeMoveMiniMax(new Chess(event.data));
};