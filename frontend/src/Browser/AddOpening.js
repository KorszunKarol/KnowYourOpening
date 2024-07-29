import React, { useState } from "react";
import { PublishOpening } from "./BackendCom";
import { useToken } from "./../contexts/TokenContext";
import "./Browser.css";
import "./AddOpening.css"

const AddOpening = ({ setShowAddOpening, onAdd }) => {
  const [openingName, setOpeningName] = useState("");
  const [moves, setMoves] = useState("");
  const [description, setDescription] = useState("");
  const [isWhite, setIsWhite] = useState(true);
  const [error, setError] = useState(null);
  const { currentToken } = useToken();

  const handleInputChange = (event) => {
    setOpeningName(event.target.value);
  };

  const handleMovesChange = (event) => {
    setMoves(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleToggleColor = () => {
    setIsWhite((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newOpening = await PublishOpening(
        openingName,
        moves,
        description,
        isWhite,
        currentToken
      );

      setOpeningName("");
      setMoves("");
      setDescription("");
      onAdd(newOpening);
      setShowAddOpening(false);
      setError(null);
    } catch (error) {
      console.error("Error publishing opening:", error);
      setError("Incorrect sequence");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onAdd();
    setShowAddOpening(false);
    setError(null);
  };

  return (
    <div className="AddOpening">
      {error && <p className="error">{error}</p>}{" "}
      <form>
        <div className="form-group">
          <label htmlFor="openingName">Opening Name:</label>
          <input
            type="text"
            id="openingName"
            value={openingName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="moves">Moves:</label>
          <input
            type="text"
            id="moves"
            value={moves}
            onChange={handleMovesChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="form-group color-toggle">
          <label htmlFor="color">Color:</label>
          <div>
            <label htmlFor="white">White</label>
            <input
              type="radio"
              id="white"
              name="color"
              checked={isWhite}
              onChange={handleToggleColor}
            />
          </div>
          <div>
            <label htmlFor="black">Black</label>
            <input
              type="radio"
              id="black"
              name="color"
              checked={!isWhite}
              onChange={handleToggleColor}
            />
          </div>
        </div>

        <div className="buttons">
          <button type="submit" onClick={handleSubmit}>
            Add
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOpening;
