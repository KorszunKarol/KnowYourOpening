import "./Pieces.css";
import { generatePossibleMoves } from "./PiecesHelper";

const pieceColorMap = {
  w: "white",
  b: "black",
};

export const getLegalMoves = (rank, file, gameState, perspective) => {
  if (perspective === "black") {
    rank = 7 - rank;
    file = 7 - file;
  }
  const from = `${String.fromCharCode(97 + Number(file))}${Number(rank) + 1}`;

  try {
    const pieceData = gameState.pieces.find((p) => p.position === from);

    return pieceData.possibleMoves;
  } catch (error) {
    const pieceData = generatePossibleMoves(from);

    return pieceData;
  }
};

const isDraggable = (piece, gameState) => {
  let pieceToMove = pieceColorMap[piece[0]];

  try {
    if (pieceToMove === gameState.opening.playerSide) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const Piece = ({ rank, file, piece, gameState, perspective }) => {
  const onDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    try {
      const legalMoves = getLegalMoves(rank, file, gameState, perspective);

      legalMoves.forEach((move) => {
        const square = document.querySelector(`.square-${move}`);

        if (square) {
          square.classList.add("highlight");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (e) => {
    const highlightedSquares = document.querySelectorAll(".highlight");
    highlightedSquares.forEach((square) => {
      square.classList.remove("highlight");
    });
  };

  return (
    <div
      className={`piece ${piece} p-${file}${rank}`}
      draggable={isDraggable(piece, gameState)}
      onDragStart={isDraggable(piece, gameState) ? onDragStart : null}
      onDragEnd={isDraggable(piece, gameState) ? onDragEnd : null}
    />
  );
};

export default Piece;
