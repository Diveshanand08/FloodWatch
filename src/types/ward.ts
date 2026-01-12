// src/types/ward.ts
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface WardData {
  id: string;
  name: string;
  zone: string;
  population: string;
  currentRisk: RiskLevel;
  currentRainfall: number;
  drainCapacity: number;
  activeIncidents: number;
  lastFlood: string;

  historicalRisk: RiskLevel;
  historicalIncidents: number; 
  floodFrequency: number;      
  severeFloods: number;        
  peakRainfall: string;        
  avgDrainCapacity: number;    
}