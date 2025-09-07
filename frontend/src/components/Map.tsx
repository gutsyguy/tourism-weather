"use client";

import { useMap } from "@/context/MapContext";
import { useEffect } from "react";
import L from "leaflet";

export const Map = () => {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const marker = L.marker([51.5, -0.09]).addTo(map);
    marker.bindPopup("Hello Leaflet!").openPopup();

    return () => {
      map.removeLayer(marker);
    };
  }, [map]);

  return (
    <div 
      id="global-map" 
      style={{ 
        height: "90%", 
        width: "100%",
        position: "relative",
        zIndex: 1
      }}
    />
  );
};
