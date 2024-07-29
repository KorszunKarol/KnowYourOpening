import React from 'react';
import './Browser.css';

const BrowseBtn = () => {
  const onClick = () => {
    const browserElement = document.querySelector(".Browser");
    browserElement.style.opacity === "1"
      ? (browserElement.style.opacity = "0")
      : (browserElement.style.opacity = "1");
  };
  return (
    <div className="BrowseBtn" onClick={onClick}>
      <button>Browse</button>
    </div>
  );
};

export default BrowseBtn;