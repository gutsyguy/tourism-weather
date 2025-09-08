"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { Loader } from "@googlemaps/js-api-loader";
import dynamic from "next/dynamic";

interface MapContextType {
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: string | null;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          console.warn("Google Maps API key is missing");
          setError("Google Maps API key is missing");
          setIsLoaded(false);
          return;
        }
        

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        });

        const google = await loader.load();

        await new Promise(resolve => setTimeout(resolve, 100));

        if (!mapRef.current || !isMounted) return;

        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true,
        });

        if (isMounted) {
          mapInstanceRef.current = newMap;
          setMap(newMap);
          setIsLoaded(true);
          setError(null);
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Failed to load Google Maps");
          setIsLoaded(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        setMap(null);
        setIsLoaded(false);
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <MapContext.Provider value={{ map: null, isLoaded: false, error: null }}>
        <div style={{ height: "100vh", width: "100%" }} />
        {children}
      </MapContext.Provider>
    );
  }

  if (error) {
    return (
      <MapContext.Provider value={{ map: null, isLoaded: false, error }}>
        <div 
          style={{ 
            height: "100vh", 
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "#f0f0f0",
            color: "#666"
          }}
        >
          <h2>Map Error</h2>
          <p>{error}</p>
        </div>
        {children}
      </MapContext.Provider>
    );
  }

  return (
    <MapContext.Provider value={{ map, isLoaded, error }}>
      <div ref={mapRef} style={{ height: "95vh", width: "100%" }} />
      {children}
    </MapContext.Provider>
  );
};

export const MapProviderDynamic = dynamic(
  () => import("@/context/MapContext").then((mod) => mod.MapProvider),
  { ssr: false }
);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within MapProvider");
  return context;
};
