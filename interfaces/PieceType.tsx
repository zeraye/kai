import { Color, PieceSymbol, Square } from "chess.js";

interface PieceType {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export default PieceType;
