"use client";

import { useMap } from "@/context/MapContext";
import { useEffect, useState } from "react";

export const Map = () => {
  const { map } = useMap();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !map) return;

    const addMarker = async () => {
      const L = await import("leaflet");
      
      const marker = L.marker([51.5, -0.09]).addTo(map);
      marker.bindPopup("Hello Leaflet!").openPopup();

      return () => {
        map.removeLayer(marker);
      };
    };

    const cleanup = addMarker();

    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [map, isClient]);

  if (!isClient) {
    return (
      <div 
        style={{ 
          height: "100vh", 
          width: "100%",
          position: "relative",
          zIndex: 1,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Loading map...
      </div>
    );
  }

  return null; // Map is rendered by MapContext
};
