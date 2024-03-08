import { BLACK, Color, WHITE } from "chess.js";

import { PageType } from "../../../interfaces/PageType";

interface MenuProps {
  setPageHandler: (newPage: PageType) => void;
  setPlayerHandler: (newPlayer: Color) => void;
}

const Menu = ({ setPageHandler, setPlayerHandler }: MenuProps) => {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "grid" }}>
        <p>Choose your color</p>
        <button
          onClick={() => {
            setPlayerHandler(WHITE);
            setPageHandler("Game");
          }}
        >
          White
        </button>
        <button
          onClick={() => {
            setPlayerHandler(BLACK);
            setPageHandler("Game");
          }}
        >
          Black
        </button>
      </div>
    </div>
  );
};

export default Menu;
