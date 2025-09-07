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
import dynamic from "next/dynamic";

interface MapContextType {
  map: LeafletMap | null;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || map) return;

    let newMap: LeafletMap | null = null;

    const initMap = async () => {
      const L = await import("leaflet");
      
      // Fix default icon paths for Vercel deployment
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      newMap = L.map(mapRef.current!).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(newMap);

      setMap(newMap);
    };

    initMap();

    return () => {
      if (newMap) {
        newMap.remove();
        setMap(null);
      }
    };
  }, [isClient, map]);

  if (!isClient) {
    return (
      <MapContext.Provider value={{ map: null }}>
        <div style={{ height: "100vh", width: "100%" }} />
        {children}
      </MapContext.Provider>
    );
  }

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />
      {children}
    </MapContext.Provider>
  );
};

// Dynamic client-only provider for SSR
export const MapProviderDynamic = dynamic(
  () => import("@/context/MapContext").then((mod) => mod.MapProvider),
  { ssr: false }
);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within MapProvider");
  return context;
};
