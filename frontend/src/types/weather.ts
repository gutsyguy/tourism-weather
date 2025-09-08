export interface WeatherPoint {
  timestamp: string;
  temperature: number;
  wind_x: number;
  wind_y: number;
  dewpoint: number;
  pressure: number | null;
  precip: number;
}


export type AnomalyType = "Heat" | "Cold" | "High Wind" | "Precipitation";

export interface Anomaly {
  type: AnomalyType;
  point: WeatherPoint;
  description: string;
}