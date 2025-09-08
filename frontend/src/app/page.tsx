"use client";

import { MapProviderDynamic } from "@/context/MapContext";
import { Map } from "@/components/Map";

export default function Home() {
  return (
    <div>
      <MapProviderDynamic>
        <Map />
      </MapProviderDynamic>
    </div>
  );
}
