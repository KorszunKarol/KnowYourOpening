import React, { useState } from "react";
import { useOpening } from "./../contexts/OpeningContext";
import "./OpeningBar.css";
import Moves from "./Moves";

const OpeningBar = () => {
  const { currentOpening } = useOpening();
  const [showMoves, setShowMoves] = useState(false);

  const toggleMoves = () => {
    setShowMoves(!showMoves);
  };

  return (
    <div className="OpeningBar">
      {currentOpening ? (
        <>
          <h2>Currently Playing:</h2>
          <p>{currentOpening.name}</p>
          <p>{currentOpening.description}</p>
          <button onClick={toggleMoves}>Show Moves</button>
          {showMoves && <Moves moves={currentOpening.moves} />}
        </>
      ) : (
        <p>No opening is currently playing.</p>
      )}
    </div>
  );
};

export default OpeningBar;
