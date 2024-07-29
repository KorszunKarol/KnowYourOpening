import React from 'react';

const FlipButton = ({ onFlip }) => {
  return (
    <button onClick={onFlip}>
      Flip Board
    </button>
  );
};

export default FlipButton;