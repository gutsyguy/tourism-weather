// app/page.tsx
import { MapProvider } from "@/context/MapContext";
import { Map } from "@/components/Map";

export default function Home() {
  return (
    <div>
      <MapProvider>
        <Map />
      </MapProvider>
    </div>
  );
}
