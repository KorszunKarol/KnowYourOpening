import React, { createContext, useContext, useState } from "react";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [currentToken, setCurrentToken] = useState(null);

  const setToken = (token) => {
    setCurrentToken(token);
  };

  return (
    <TokenContext.Provider value={{ currentToken, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
