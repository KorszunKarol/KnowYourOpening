import axios from "axios";
import React from "react";
import { useOpening } from "../contexts/OpeningContext";


const RandomButton = ({ onChooseRandom }) => {
    const { playOpening } = useOpening();

    const handleRandomClick = async () => {
        try {
          const response = await axios.get("http://localhost:8080/game/new");
          const randomOpening = response.data;
          await setOpening(randomOpening);
          onChooseRandom(randomOpening);
        } catch (error) {
          console.error("Error fetching random opening:", error);
        }
      };


  return (
    <button onClick={handleRandomClick}>Choose Random Opening</button>
  );
};

export default RandomButton;
