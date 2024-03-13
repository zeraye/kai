import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { BLACK, Color, WHITE } from "chess.js";

import { PageType } from "../../../interfaces/PageType";

interface MenuProps {
  setPageHandler: (newPage: PageType) => void;
  setPlayerHandler: (newPlayer: Color) => void;
}

const Menu = ({ setPageHandler, setPlayerHandler }: MenuProps) => {
  const startGame = (color: Color) => {
    setPlayerHandler(color);
    setPageHandler("Game");
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "grid" }}>
        <Typography variant="h4">Choose your color</Typography>
        <ButtonGroup
          variant="outlined"
          style={{ margin: "auto", padding: "1em" }}
        >
          <Button onClick={() => startGame(WHITE)}>White</Button>
          <Button onClick={() => startGame(BLACK)}>Black</Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default Menu;
