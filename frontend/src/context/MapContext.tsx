"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import type { Map as LeafletMap } from "leaflet";

interface MapContextType {
  map: LeafletMap | null;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let newMap: LeafletMap | null = null;

    const init = async () => {
      const L = await import("leaflet");

      if (mapRef.current && !map) {
        newMap = L.map(mapRef.current).setView([0, 0], 2);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(newMap);

        setMap(newMap);
      }
    };

    init();

    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, [map]);

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />
      {children}
    </MapContext.Provider>
  );
};

// ✅ Dynamic client-only provider
import dynamic from "next/dynamic";
export const MapProviderDynamic = dynamic(
  () => import("@/context/MapContext").then((mod) => mod.MapProvider),
  { ssr: false }
);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within MapProvider");
  return context;
};
