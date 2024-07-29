import React from "react";
import { styled } from "@mui/system";

const Moves = ({ moves }) => {
  const movesList = moves
    .split("-")
    .join("")
    .match(/.{1,4}/g);


  return (
    <MovesContainer>
      <h3>Moves:</h3>
      <MovesList>
        {movesList.map((move, index) => (
          <MoveItem key={index} isWhite={index % 2 === 0}>
            <span>{move.slice(0, 2)}</span> {}
            <span>&rarr;</span> {}
            <span>{move.slice(2, 4)}</span> {}
          </MoveItem>
        ))}
      </MovesList>
    </MovesContainer>
  );
};

const MovesContainer = styled("div")({
  width: "100%",
  maxWidth: "300px",
  margin: "0 auto",
  textAlign: "center",
});

const MovesList = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const MoveItem = styled("div")(({ isWhite }) => ({
  backgroundColor: isWhite ? "#fff" : "#000",
  color: isWhite ? "#000" : "#fff",
  padding: "8px",
  margin: "4px 0",
  borderRadius: "4px",
  minWidth: "60px",
  textAlign: "center",
  display: "inline-block",
  width: "80%",
}));

export default Moves;
