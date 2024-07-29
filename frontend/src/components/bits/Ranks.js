import { useContext } from "react";
import { usePerspective } from "../../contexts/PerspectiveContext";
import "./Ranks.css";

const Ranks = ({ ranks }) => {
  const { perspective } = usePerspective();

  return (
    <div className="ranks">
      {(perspective === "white" ? ranks : [...ranks].reverse()).map((rank) => (
        <span key={rank}>{rank}</span>
      ))}
    </div>
  );
};

export default Ranks;