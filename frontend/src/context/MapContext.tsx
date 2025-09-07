// context/MapContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import L, { Map as LeafletMap } from "leaflet";

interface MapContextType {
  map: LeafletMap | null;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    if (!map) {
      const newMap = L.map("global-map").setView([0, 0], 2); // default center
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(newMap);
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []);

  return <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within MapProvider");
  return context;
};
