import { createContext, useContext } from "react";

export type FloodContextType = {
  rainfall: number;
  drainCapacityUsed: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  pumpLoad: "light" | "normal" | "heavy" | "overloaded";
};

export const FloodContext = createContext<FloodContextType | null>(null);

export const useFloodContext = () => {
  const ctx = useContext(FloodContext);
  if (!ctx) {
    throw new Error("useFloodContext must be used inside FloodProvider");
  }
  return ctx;
};
