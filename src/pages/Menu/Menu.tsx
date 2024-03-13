import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { BLACK, Color, WHITE } from "chess.js";

import { useState } from "react";

import { HeuristicsType } from "../../../interfaces/HeuristicsType";
import { PageType } from "../../../interfaces/PageType";

interface MenuProps {
  setPageHandler: (newPage: PageType) => void;
  setPlayerHandler: (newPlayer: Color) => void;
  setHeuristicsHandler: (newHeuristics: HeuristicsType) => void;
}

const Menu = ({
  setPageHandler,
  setPlayerHandler,
  setHeuristicsHandler,
}: MenuProps) => {
  const [heuristics, setHeuristics] = useState<HeuristicsType>("complex");

  const startGame = (color: Color) => {
    setPlayerHandler(color);
    setHeuristicsHandler(heuristics);
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
        <Typography variant="h4">Choose your heuristics and color</Typography>
        <Divider sx={{ p: "1rem" }} />
        <FormControl fullWidth>
          <InputLabel id="heuristics">Heuristics</InputLabel>
          <Select
            labelId="heuristics"
            variant="outlined"
            label="Heuristics"
            value={heuristics}
            onChange={(newHeuristics) =>
              setHeuristics(newHeuristics.target.value as HeuristicsType)
            }
          >
            <MenuItem value="simple">Simple</MenuItem>
            <MenuItem value="complex" selected>
              Complex
            </MenuItem>
          </Select>
        </FormControl>
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
