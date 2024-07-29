import { useContext } from "react";
import { usePerspective } from "../../contexts/PerspectiveContext";
import { getCharacter } from "../../helper";
import "./Files.css";


const Files = ({ files }) => {
  const { perspective } = usePerspective();

  return (
    <div className="files">
      {(perspective === "white" ? files : [...files].reverse()).map((file) => (
        <span key={file}>{getCharacter(file)}</span>
      ))}
    </div>
  );
};

export default Files;