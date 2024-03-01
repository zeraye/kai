import { Chess, Move, PieceSymbol } from "chess.js";

const MAX_DEPTH = 5;

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

const MiniMaxRecursive = (
  chess: Chess,
  alphabeta: {
    alpha: number;
    beta: number;
  },
  depth: number,
  isMax: boolean,
): number => {
  if (chess.isGameOver() || depth === 0) {
    return evalPosition(chess);
  }

  let bestEval = Infinity * (isMax ? -1 : 1);

  let skipCalculation = false;

  chess.moves().forEach((move) => {
    if (skipCalculation) {
      return;
    }

    const chessCopy = new Chess(chess.fen());
    chessCopy.move(move);

    const newEval = MiniMaxRecursive(chessCopy, alphabeta, depth - 1, !isMax);

    if (isMax) {
      if (newEval > bestEval) {
        bestEval = newEval;
      }
      if (bestEval > alphabeta.alpha) {
        alphabeta.alpha = bestEval;
      }
    } else {
      if (newEval < bestEval) {
        bestEval = newEval;
      }
      if (bestEval < alphabeta.beta) {
        alphabeta.beta = bestEval;
      }
    }

    if (alphabeta.beta <= alphabeta.alpha) {
      skipCalculation = true;
      return;
    }
  });

  return bestEval;
};

const MiniMax = (chess: Chess, depth: number): [Move | null, number] => {
  const isMax = chess.turn() === "w";

  const alphabeta = {
    alpha: -Infinity,
    beta: Infinity,
  };

  let bestMove: Move | null = null;
  let bestEval = Infinity * (isMax ? -1 : 1);

  chess.moves({ verbose: true }).forEach((move) => {
    const chessCopy = new Chess(chess.fen());
    chessCopy.move(move);

    const newEval = MiniMaxRecursive(chessCopy, alphabeta, depth, !isMax);

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

  for (let depth = 1; depth < MAX_DEPTH; ++depth) {
    try {
      [bestMove, bestEval] = MiniMax(chess, depth);
    } catch (error) {
      console.error(error);
      break;
    }
  }

  console.log(bestMove, bestEval);

  if (bestMove === null || bestEval === null) {
    console.error("Error in minimax. Making random move...");
    const moves = chess.moves();
    chess.move(moves[Math.floor(Math.random() * moves.length)]);
    return 0;
  }

  chess.move(bestMove);

  return bestEval;
};

export default MakeMoveMiniMax;
