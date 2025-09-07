"use client";

import { useMap } from "@/context/MapContext";
import { useEffect, useState } from "react";
import type { Marker } from "leaflet";

export const Map = () => {
  const { map } = useMap();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !map) return;

    let marker: Marker | null = null;
    let isMounted = true;

    const addMarker = async () => {
      try {
        const L = await import("leaflet");
        
        if (!isMounted || !map) return;
        
        marker = L.marker([51.5, -0.09]).addTo(map);
        marker.bindPopup("Hello Leaflet!").openPopup();
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    };

    addMarker();

    return () => {
      isMounted = false;
      if (marker && map) {
        try {
          map.removeLayer(marker);
        } catch (error) {
          console.error("Error removing marker:", error);
        }
      }
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
