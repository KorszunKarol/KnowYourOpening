import React from 'react';

const PerspectiveContext = React.createContext();

export const PerspectiveProvider = ({ children }) => {
  const [perspective, setPerspective] = React.useState('white');

  return (
    <PerspectiveContext.Provider value={{ perspective, setPerspective }}>
      {children}
    </PerspectiveContext.Provider>
  );
};

export const usePerspective = () => {
  const context = React.useContext(PerspectiveContext);
  if (context === undefined) {
    throw new Error('usePerspective must be used within a PerspectiveProvider');
  }
  return context;
};

export default PerspectiveContext;