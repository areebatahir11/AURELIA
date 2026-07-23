"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CompareContext = createContext(undefined);
const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = useCallback((vehicleId) => {
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, vehicleId];
    });
  }, []);

  const removeFromCompare = useCallback((vehicleId) => {
    setCompareList((prev) => prev.filter((id) => id !== vehicleId));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const isComparing = useCallback((vehicleId) => compareList.includes(vehicleId), [compareList]);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isFull: compareList.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompareContext() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompareContext must be used within a CompareProvider");
  }
  return context;
}
