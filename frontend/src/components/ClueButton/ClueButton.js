import React, { useState } from 'react';

const ClueButton = () => {
  const [nextMove, setNextMove] = useState(null);

  const handleClick = async () => {
    const jsonData = {};
    const move = await getCorrectMove(jsonData, true);
    setNextMove(move);
    alert(`Next move: ${move}`);
  };

  return (
    <button onClick={handleClick}>Get Clue</button>
  );
};

export default ClueButton;