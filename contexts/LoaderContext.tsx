import Loader from "components/Loader";
import React, { createContext, useContext, useState } from "react";

interface LoaderContextType {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context
};

export const LoaderProvider = ({ children }: any) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ globalLoading, setGlobalLoading }}>
      {globalLoading && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
};
