import { Chess } from "chess.js";

import { useState } from "react";

import Analysis from "./components/Analysis/Analysis";
import Chessboard from "./components/Chessboard/Chessboard";
import Timer from "./components/Timer/Timer";

const App = () => {
  const [chess, setChess] = useState(new Chess());

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(20%, max-content) auto minmax(20%, max-content)",
        alignItems: "center",
      }}
    >
      <Analysis />
      <Chessboard chess={chess} />
      <Timer />
    </div>
  );
};

export default App;
