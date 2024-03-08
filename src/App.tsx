import { Color, WHITE } from "chess.js";

import { useState } from "react";

import { PageType } from "../interfaces/PageType";
import Game from "./pages/Game/Game";
import Menu from "./pages/Menu/Menu";

const App = () => {
  const [page, setPage] = useState<PageType>("Menu");
  const [player, setPlayer] = useState<Color>(WHITE);

  const setPageHandler = (newPage: PageType) => {
    setPage(newPage);
  };

  const setPlayerHandler = (newPlayer: Color) => {
    setPlayer(newPlayer);
  };

  return page === "Menu" ? (
    <Menu setPageHandler={setPageHandler} setPlayerHandler={setPlayerHandler} />
  ) : (
    <Game player={player} />
  );
};

export default App;
