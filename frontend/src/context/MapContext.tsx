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
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const L = await import("leaflet");
        
        // Fix default icon paths for Vercel deployment
        delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/marker-icon-2x.png",
          iconUrl: "/leaflet/marker-icon.png",
          shadowUrl: "/leaflet/marker-shadow.png",
        });

        // Small delay to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Ensure the DOM element is still available
        if (!mapRef.current || !isMounted) return;

        const newMap = L.map(mapRef.current).setView([0, 0], 2);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(newMap);

        if (isMounted) {
          mapInstanceRef.current = newMap;
          setMap(newMap);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMap(null);
      }
    };
  }, [isClient]);

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
