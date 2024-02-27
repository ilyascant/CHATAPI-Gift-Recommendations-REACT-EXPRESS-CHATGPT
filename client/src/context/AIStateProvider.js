import { createContext, useContext, useReducer } from "react";

const AIStateContext = createContext();

export const AIStateProvider = ({ reducer, initialState, children }) => (
  <AIStateContext.Provider value={useReducer(reducer, initialState)}>{children}</AIStateContext.Provider>
);

export const useAIStateValue = () => useContext(AIStateContext);
