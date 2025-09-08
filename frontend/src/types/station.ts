import { z } from "zod";

export const zStation = z.object({
  station: z.string().nonempty(),
  latitude: z.float64(),
  longitude: z.float64(),
  elevation: z.float32(),
  station_name: z.string().nonempty(),
  station_network: z.string().nonempty(),
  timezone: z.string().nonempty(),
});

export interface Station {
  station_id: string;
  latitude: number;
  longitude: number;
  elevation: number;
  station_name: string;
  station_network: string;
  timezone: string;
}

export interface Stations {
  data: Station[];
  corrupted_records: number;
}

export interface Point {
  timestamp: string; // e.g., "2025-08-29 23:25"
  temperature: number;
  wind_x: number;
  wind_y: number;
  dewpoint: number;
  pressure: number | null; // can be null
  precip: number;
}

export interface StationData {
  station: string; // e.g., "EHAK"
  points: Point[];
}
