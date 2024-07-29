import React, { useReducer, useEffect, useState } from "react";
import BrowseBtn from "./Browser/BrowseBtn";
import Browser from "./Browser/Browser";
import OpeningBar from "./OpeningBar/OpeningBar";
import Board from "./components/Board/Board";
import Notification from "./components/Notification/Notification";
import { reducer } from "./reducer/reducer";
import { initGameState } from "./constant";
import AppContext from "./contexts/Context";
import { useToken } from "./contexts/TokenContext";
import { fetchGameState } from "./helper";
import { OpeningProvider } from "./contexts/OpeningContext";
import { getDefaultPosition } from "./components/Pieces/PiecesHelper";
import { positions } from "@mui/system";

const AppContent = () => {
  const { currentToken } = useToken();
  const [appState, dispatch] = useReducer(reducer, initGameState);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const initializeGameState = async (isFetchState = true) => {
    if (!currentToken) return;
    let gameState = {};
    try {
      if (isFetchState) {
        try {
          gameState = await fetchGameState(currentToken);
        } catch (error) {
          let pieces = getDefaultPosition();
          gameState = {
            position: [pieces],
            turn: "w",
          };
        }
      } else {
        let pieces = getDefaultPosition();
        gameState = {
          position: [pieces],
          turn: "w",
        };
      }

      dispatch({ type: "INIT_GAME_STATE", payload: gameState });
    } catch (error) {
      console.error("Error initializing game state:", error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (currentToken && !initialized) {
      initializeGameState(true);

    }
  }, [currentToken, initialized]);

  const providerState = {
    appState,
    dispatch,
    initializeGameState,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider value={providerState}>
      <OpeningProvider initializeGameState={initializeGameState}>
        <Board />
        <Notification />
        <BrowseBtn />
        <Browser />
        <OpeningBar />
      </OpeningProvider>
    </AppContext.Provider>
  );
};
export default AppContent;
