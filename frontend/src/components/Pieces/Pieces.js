import "./Pieces.css";
import Piece from "./Piece";
import { useEffect, useRef, useState } from "react";
import { copyPosition } from "../../helper";
import { useAppContext } from "../../contexts/Context";
import { makeNewMove } from "../../reducer/actions/move";
import axios from "axios";
import { getLegalMoves } from "./Piece";
import {
  getCorrectMove,
  generateStartingPossibleMoves,
  handleFirstMove,
} from "./PiecesHelper";
import { faThermometerThreeQuarters } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { NotificationContext } from "../../contexts/NotificationContext";
import { useOpening } from "../../contexts/OpeningContext";
import { usePerspective } from "../../contexts/PerspectiveContext";
import { useToken } from "./../../contexts/TokenContext";
import { getDefaultPosition } from "./PiecesHelper";

const Pieces = ({ initializeGameState }) => {
  const ref = useRef();
  const { appState, dispatch } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const { currentOpening, setCurrentOpening } = useOpening();
  const [isSequenceEnded, setIsSequenceEnded] = useState(false);
  const { setNotification } = useContext(NotificationContext);
  const { currentToken } = useToken();
  const { perspective, setPerspective } = usePerspective();
  const [nextMove, setNextMove] = useState(null);
  const defaultPosition = getDefaultPosition();
  const [mistakes, setMistakes] = useState(0);
  const [openingSuccess, setOpeningSuccess] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  let finishEarly = false;
  let humanMove = true;

  useEffect(() => {
    if (currentOpening) {
      handleButtonClick();
    }
  }, [currentOpening]);

  const config = {
    headers: {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    if (openingSuccess) {
      setNotification({
        type: "success",
        message: "Sequence completed successfully",
      });
      setTimeout(() => {
        handleButtonClick();
        setOpeningSuccess(false);
      }, 500);
    }
  }, [openingSuccess]);

  useEffect(() => {
    if (currentOpening) {
      setPerspective(currentOpening.player === "white" ? "white" : "black");
    }
  }, [currentOpening]);

  let currentPosition = null;
  if (appState.position && !firstLoading) {
    currentPosition = appState.position[appState.position.length - 1];
  } else {
    currentPosition = defaultPosition;
    setFirstLoading(false);
  }

  async function handleButtonClick() {
    try {
      initializeGameState(false);
      if (currentOpening.player === "black") {
        let moves = currentOpening.moves
          .split("-")
          .map((move) => move.slice(0, 2));
        let newPos = handleFirstMove(moves, defaultPosition);
        dispatch({ type: "NEW_MOVE", payload: { newPosition: newPos } });
      }
      let openingId = currentOpening.id;
      currentPosition = defaultPosition;
      axios
        .get(`http://localhost:8080/game/new/${openingId}`, config)
        .then((response) => {
          setResponseData(response.data);
          currentPosition = defaultPosition;
        })
        .catch((error) => {
          console.error("Error starting game:", error);
        });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  function getFromTo(file, rank, x, y) {
    let newRank = rank;
    let newFile = file;
    let newX = x;
    let newY = y;

    if (perspective === "black") {
      newRank = 7 - rank;
      newFile = 7 - file;
      newX = 7 - x;
      newY = 7 - y;
    }
    const from = `${String.fromCharCode(97 + Number(newFile))}${
      Number(newRank) + 1
    }`;
    const to = `${String.fromCharCode(97 + newY)}${newX + 1}`;

    return { from, to, newRank, newFile, newX, newY };
  }

  function fetchSequence(currentOpening) {
    currentOpening = currentOpening;
    if (currentOpening && currentOpening.moves) {
      return currentOpening.moves;
    } else {
      console.error("currentOpening or currentOpening.moves is undefined");
      return null;
    }
  }

  async function getCorrectMove(jsonData, humanMove = true) {
    let sequence = await fetchSequence(currentOpening);
    if (!sequence) {
      console.error("Sequence is undefined");
      return null;
    }

    try {
      let moves = sequence
        .match(/.{5}/g)
        .map((move) => [move.slice(0, 2), move.slice(3)]);

      let allMoves = jsonData.sequence
        .match(/.{5}/g)
        .map((move) => [move.slice(0, 2), move.slice(3)]);

      let lastMove = allMoves[allMoves.length - 1];

      let lastMoveIndex = moves.findIndex(
        (move) => move[0] === lastMove[0] && move[1] === lastMove[1]
      );

      if (humanMove) {
        let moveToMake = jsonData.nextMove.split("-");

        if (moveToMake.length === 0) {
          return moves[0];
        }
        return moveToMake;
      } else {
        return allMoves[allMoves.length - 1];
      }
    } catch (error) {
      console.error(error);

      let moves = sequence
        .match(/.{5}/g)
        .map((move) => [move.slice(0, 2), move.slice(3)]);
      return moves[0];
    }
  }

  const calculateCoords = (e) => {
    const { top, left, width } = ref.current.getBoundingClientRect();
    const size = width / 8;
    const x = 7 - Math.floor((e.clientY - top) / size);
    const y = Math.floor((e.clientX - left) / size);

    return { x, y };
  };

  const makeComputerMove = async (data, position) => {
    if (finishEarly) {
      return position;
    }

    let newPos = JSON.parse(JSON.stringify(position));
    const computerMove = await getCorrectMove(data, false, currentToken);

    let from = computerMove[0];
    let to = computerMove[1];

    let rank = from.charCodeAt(0) - 97;
    let file = from[1] - 1;

    let x = to.charCodeAt(0) - 97;
    let y = to[1] - 1;

    const p = newPos[file][rank];
    newPos[file][rank] = "";
    newPos[y][x] = p;

    return newPos;
  };

  const makeMove = async (e, position) => {
    e.preventDefault();
    let [p, rank, file] = e.dataTransfer.getData("text").split(",");
    let { x, y } = calculateCoords(e);
    let { from, to, newRank, newFile, newX, newY } = getFromTo(
      file,
      rank,
      x,
      y
    );
    const legalMoves = getLegalMoves(rank, file, responseData, perspective);
    try {
      if (legalMoves.length === 0) {
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }



    position[newRank][newFile] = "";

    const correctMove = await getCorrectMove(responseData, true);

    if (from === to) {
      return 1;
    }

    if (!validateMove(from, to, correctMove)) {
      setMistakes(mistakes + 1);

      axios
        .put("http://localhost:8080/game/mistake", {}, config)
        .then((response) => {

        })
        .catch(console.error);
      setOpeningSuccess(false);

      return;
    }


    position[newRank][newFile] = "";
    position[newX][newY] = p;

    return { newPosition: position, from, to };
  };

  const validateMove = (from, to, correctMove) => {
    try {
      if (from === correctMove[0] && to === correctMove[1]) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();

    let newPosition = JSON.parse(JSON.stringify(currentPosition));
    let from = "";
    let to = "";

    const result = await makeMove(e, newPosition);
    if (!result) {
      setNotification({ type: "error", message: "Incorrect move" });
      return;
    } else if (result == 1) {
      return;
    } else {
      setNotification({ type: "success", message: "Correct move" });
    }

    ({ newPosition, from, to } = result);

    axios
      .put(`http://localhost:8080/game/${from}-${to}`, {}, config)
      .then(async (response) => {
        {
          setResponseData(response.data);
          if (response.data.nextMove == "") {
            setIsSequenceEnded(true);
            setOpeningSuccess(true);
            finishEarly = true;
          }
          setNextMove(response.data.nextMove);

          const newPos = await makeComputerMove(
            response.data,
            newPosition,
            finishEarly
          );

          dispatch({ type: "NEW_MOVE", payload: { newPosition: newPos } });
        }
      });
  };

  const onDragOver = (e) => e.preventDefault();

  return (
    <div ref={ref} onDrop={onDrop} onDragOver={onDragOver} className="pieces">
      {currentPosition !== undefined &&
        (perspective === "white"
          ? currentPosition
          : currentPosition
              .slice()
              .reverse()
              .map((row) => row.slice().reverse())
        ).map((r, rank) =>
          r.map((f, file) =>
            f ? (
              <Piece
                key={rank + "-" + file}
                rank={rank}
                file={file}
                piece={f}
                gameState={responseData}
                perspective={perspective}
              />
            ) : null
          )
        )}
      <button onClick={handleButtonClick} className="reset-button">
        Reset Game
      </button>
      <button
        onClick={() =>
          setPerspective(perspective === "white" ? "black" : "white")
        }
        className="flip-button"
      >
        Flip Perspective
      </button>
    </div>
  );
};

export default Pieces;
