import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "@fortawesome/fontawesome-svg-core";


const OpeningStats = ({ stats, id }) => {


  return (
    <div>
      {stats ? (
        <>
          <p>Correct: {stats.correct}</p>
          <p>Incorrect: {stats.incorrect}</p>
          <p>Last Trained: {stats.lastTrained} days ago</p>
          <p>
            Correct %:{" "}
            {(stats.correct / (stats.correct + stats.incorrect) * 100).toFixed(2)}
          </p>
        </>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
};

export default OpeningStats;
