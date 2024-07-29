import axios from "axios";
import { useOpening } from "../../contexts/OpeningContext";

let sequence = null;

const config = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

async function fetchSequence(token) {
  if (!sequence) {

    try {
      const response = await axios.get(
        "http://localhost:8080/opening",
        config(token)
      );
      sequence = response.data[0].moveSequence;
      return sequence;
    } catch (error) {
      console.error(error);
      return await Promise.reject(error);
    }
  } else {
    return Promise.resolve(sequence);
  }
}

export async function getCorrectMove(jsonData, humanMove = true, token) {
  sequence = await fetchSequence(token);

  try {
    let moves = sequence
      .match(/.{5}/g)
      .map((move) => [move.slice(0, 2), move.slice(3)]);


    let allMoves = jsonData.moves
      .match(/.{5}/g)
      .map((move) => [move.slice(0, 2), move.slice(3)]);

    let lastMove = allMoves[allMoves.length - 1];
    let lastMoveIndex = moves.findIndex(
      (move) => move[0] === lastMove[0] && move[1] === lastMove[1]
    );

    if (humanMove) {
      return moves[lastMoveIndex + 1];
    } else {
      return moves[lastMoveIndex];
    }
  } catch (error) {
    console.error(error);

    let moves = sequence
      .match(/.{5}/g)
      .map((move) => [move.slice(0, 2), move.slice(3)]);
    return moves[0];
  }
}

export function generatePossibleMoves(startingSquare) {
  const file = startingSquare[0];
  const rank = startingSquare[1];

  if (rank === "2") {
    return [`${file}3`, `${file}4`];
  } else if (startingSquare === "b1") {
    return ["c3", "a3"];
  } else if (startingSquare === "g1") {
    return ["h3", "f3"];
  } else {
    return [];
  }
}

export function handleFirstMove(moves, pos) {
  let from = moves[0];
  let to = moves[1];

  let rank = from.charCodeAt(0) - 97;
  let file = from[1] - 1;

  let x = to.charCodeAt(0) - 97;
  let y = to[1] - 1;

  const p = pos[file][rank];

  pos[file][rank] = "";
  pos[y][x] = p;
  return pos;
}

export function getDefaultPosition() {
  return [
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
  ];
}
