import PieceType from "../../../../interfaces/PieceType";

interface PieceProps {
  piece: PieceType;
  width: number | null;
}

const Piece = ({ piece, width }: PieceProps) => {
  return (
    <div
      style={{
        backgroundImage: `url("./assets/images/pieces/${piece.color}${piece.type}.png")`,
        backgroundSize: "100%",
        height: `calc(0.125*${width}px)`,
        width: `calc(0.125*${width}px)`,
        transform: `translate(${(piece.square.charCodeAt(0) - "a".charCodeAt(0)) * 100}%, ${(8 - parseInt(piece.square[1])) * 100}%)`,
        position: "absolute",
        cursor: "grab",
      }}
    ></div>
  );
};

export default Piece;
