import { Color, WHITE } from "chess.js";

import { useState } from "react";

import { HeuristicsType } from "../interfaces/HeuristicsType";
import { PageType } from "../interfaces/PageType";
import Game from "./pages/Game/Game";
import Menu from "./pages/Menu/Menu";

const App = () => {
  const [page, setPage] = useState<PageType>("Menu");
  const [player, setPlayer] = useState<Color>(WHITE);
  const [heuristics, setHeuristics] = useState<HeuristicsType>("complex");

  const setPageHandler = (newPage: PageType) => {
    setPage(newPage);
  };

  const setPlayerHandler = (newPlayer: Color) => {
    setPlayer(newPlayer);
  };

  const setHeuristicsHandler = (newHeuristics: HeuristicsType) => {
    setHeuristics(newHeuristics);
  };

  return page === "Menu" ? (
    <Menu
      setPageHandler={setPageHandler}
      setPlayerHandler={setPlayerHandler}
      setHeuristicsHandler={setHeuristicsHandler}
    />
  ) : (
    <Game
      player={player}
      setPageHandler={setPageHandler}
      heuristics={heuristics}
    />
  );
};

export default App;
