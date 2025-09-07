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
  station: string;
  latitude: Float16Array;
  longitude: Float16Array;
  elevation: Float16Array;
  station_name: string;
  station_network: string;
  timezone: string;
}

export interface Stations {
  data: Station[];
  corrupted_records: number;
}
