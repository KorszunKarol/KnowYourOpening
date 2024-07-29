import "./Board.css";
import Pieces from "../Pieces/Pieces";
import Files from "../bits/Files";
import Ranks from "../bits/Ranks";
import { usePerspective } from "../../contexts/PerspectiveContext";
import { useContext } from "react";
import AppContext from "../../contexts/Context";
import './Board.css';

const Board = () => {
  const { perspective } = usePerspective();
  const { initializeGameState } = useContext(AppContext);

  const ranks = Array(8)
    .fill()
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((x, i) => i + 1);
  const getClassName = (i, j) => {
    let c = "tile";
    c += (i + j) % 2 === 0 ? " tile--dark" : " tile--light";
    return c;
  };
  return (
    <div className="board">
      <Ranks ranks={ranks} />

      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => {
            const fileChar =
              perspective === "white"
                ? String.fromCharCode(96 + Number(file))
                : String.fromCharCode(105 - Number(file));
            const tileName =
              perspective === "white"
                ? `${fileChar}${Number(rank)}`
                : `${fileChar}${9 - Number(rank)}`;
            return (
              <div
                key={file + "" + rank}
                i={i}
                j={j}
                className={`${getClassName(9 - i, j)} square-${tileName}`}
              ></div>
            );
          })
        )}
      </div>

      <Pieces initializeGameState={initializeGameState} />

      <Files files={files} />
    </div>
  );
};


export default Board;
