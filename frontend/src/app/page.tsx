import { MapProviderDynamic } from "@/context/MapContext";
import { Map } from "@/components/Map";

export default function Home() {
  return (
    <MapProviderDynamic>
      <Map />
    </MapProviderDynamic>
  );
}
