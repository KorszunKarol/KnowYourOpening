import { useState } from "react";
import AddOpening from "./AddOpening";

const AddBtn = ({ onAdd }) => {
  const [showAddOpening, setShowAddOpening] = useState(false);

  const toggleAddOpening = () => {
    setShowAddOpening((prev) => !prev);
  };

  return (
    <div className="AddBtn">
      {!showAddOpening && (
        <button
          onClick={() => {
            toggleAddOpening();
            onAdd();
          }}
        >
          Add opening
        </button>
      )}
      {showAddOpening && (
        <AddOpening setShowAddOpening={setShowAddOpening} onAdd={onAdd} />
      )}
    </div>
  );
};

export default AddBtn;
