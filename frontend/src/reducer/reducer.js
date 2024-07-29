import actionTypes from "./actions/actionTypes";

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_MOVE: {
      let { turn, position } = state;
      turn = turn === "w" ? "b" : "w";
      position = [...position, action.payload.newPosition];

      return {
        ...state,
        turn,
        position,
      };
    }
    case 'FLIP_BOARD': {
      const perspective = state.perspective === 'white' ? 'black' : 'white';
      return {
        ...state,
        perspective,
      };
    }
    case "INIT_GAME_STATE": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};