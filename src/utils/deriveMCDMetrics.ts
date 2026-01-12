export type MCDDerivedMetrics = {
  drainCapacityUsed: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  pumpLoad: "light" | "normal" | "heavy" | "overloaded";
};

export function deriveMCDMetrics(rainfall: number): MCDDerivedMetrics {
  if (rainfall >= 50) {
    return {
      drainCapacityUsed: 90,
      riskLevel: "critical",
      pumpLoad: "overloaded",
    };
  }

  if (rainfall >= 30) {
    return {
      drainCapacityUsed: 75,
      riskLevel: "high",
      pumpLoad: "heavy",
    };
  }

  if (rainfall >= 15) {
    return {
      drainCapacityUsed: 55,
      riskLevel: "moderate",
      pumpLoad: "normal",
    };
  }

  return {
    drainCapacityUsed: 35,
    riskLevel: "low",
    pumpLoad: "light",
  };
}
