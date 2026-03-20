import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValueVisibilityContextType {
  valuesVisible: boolean;
  setValuesVisible: (visible: boolean) => void;
  toggleValues: () => void;
}

const ValueVisibilityContext = createContext<ValueVisibilityContextType | undefined>(undefined);

export const ValueVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [valuesVisible, setValuesVisible] = useState(false); // Sempre iniciar com valores ocultos

  const toggleValues = () => {
    setValuesVisible(!valuesVisible);
  };

  return (
    <ValueVisibilityContext.Provider value={{
      valuesVisible,
      setValuesVisible,
      toggleValues
    }}>
      {children}
    </ValueVisibilityContext.Provider>
  );
};

export const useValueVisibility = () => {
  const context = useContext(ValueVisibilityContext);
  if (context === undefined) {
    throw new Error('useValueVisibility must be used within a ValueVisibilityProvider');
  }
  return context;
};