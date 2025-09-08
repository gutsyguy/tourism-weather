import { Station, StationData } from "@/types/station";
import { Anomaly, AnomalyType, WeatherPoint } from "@/types/weather";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import WeatherTrendChart from "./Chart";

const Modal = ({
  station,
  setStation,
  city,
  state,
  country,
}: {
  station: Station;
  setStation: React.Dispatch<React.SetStateAction<Station | null>>;
  city: string;
  state: string;
  country: string;
}) => {
  const [places, setPlaces] = useState<PlacesResponse | null>(null);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  // Fetch station weather data
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url || !station) return;

    const fetchStationData = async () => {
      try {
        const res = await fetch(
          `${url}/api/stations/${station.station_id}/weather`
        );
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        const result = await res.json();
        setStationData(result);
      } catch (err) {
        console.error("Station data fetch error:", err);
      }
    };

    fetchStationData();
  }, [station]);

  // Detect anomalies after data is loaded
  useEffect(() => {
    if (!stationData?.points?.length) return;
    setAnomalies(
      detectAnomalies(stationData.points[stationData.points.length - 1])
    );
  }, [stationData]);

  // Fetch tourist places
  useEffect(() => {
    if (!city || !state || !country) return;

    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return;

    const fetchPlaces = async () => {
      try {
        const res = await fetch(`${url}/api/places/place`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            textQuery: `Tourist Attractions in ${city}, ${state}, ${country} to visit`,
          }),
        });
        if (res.ok) {
          const result = await res.json();
          setPlaces(result);
        } else {
          console.error("Failed to send data:", res.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlaces();
  }, [station, city, state, country]);

  if (!stationData?.points?.length) {
    return (
      <div className="absolute top-0 right-0 w-[33rem] h-[100vh] bg-white z-[999] shadow-lg flex items-center justify-center">
        Loading station data...
      </div>
    );
  }

  // ✅ Now safe to derive values because stationData exists
  const lastPoint = stationData.points[stationData.points.length - 1];
  const temperature = lastPoint.temperature;
  const dew = lastPoint.dewpoint;
  const timezone = station.timezone;
  const currentTime = moment().tz(timezone).format("HH:mm");

  const tempDescription =
    temperature >= 90
      ? "Hot"
      : temperature >= 75
      ? "Warm"
      : temperature >= 60
      ? "Mild"
      : temperature >= 45
      ? "Cool"
      : "Cold";

  const { speed, direction } = calcWind(lastPoint.wind_x, lastPoint.wind_y);
  const humidityLevel = calcHumidity(temperature, dew);

  return (
    <div className="absolute top-0 right-0 w-[33rem] h-[100vh] bg-white z-[999] shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between p-4 border-b">
        <div>
          <h1 className="font-semibold text-2xl">{city}</h1>
          <h2>
            {state}, {country}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <h1>
            {tempDescription} · {temperature}°F
          </h1>
          <h2>{currentTime}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <p>Humidity: {humidityLevel}%</p>
        <p>
          Wind: {speed} mph, {direction}
        </p>
        <p>Station Name: {station.station_name}</p>
        <p>Network: {station.station_network}</p>
        <p>Timezone: {station.timezone}</p>

        <div>
          {anomalies.map((a, i) => (
            <div key={i}>
              <strong>{a.description}</strong>
            </div>
          ))}
        </div>

        <hr />

        <WeatherTrendChart stationData={stationData} timezone={timezone} />

        <hr />

        <h2>Tourist Activities</h2>
        {places?.data.places.map((place, index) => (
          <li key={index}>{place.displayName.text}</li>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setStation(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* Helpers moved outside so hooks order stays fixed */
function calcWind(windX: number, windY: number) {
  const speed = Math.round(Math.sqrt(windX * windX + windY * windY));
  const dirDeg = ((Math.atan2(windY, windX) * 180) / Math.PI + 360) % 360;
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirIndex = Math.round(dirDeg / 45) % 8;
  return { speed, direction: directions[dirIndex] };
}

function calcHumidity(tempF: number, dewF: number): number {
  const tempC = ((tempF - 32) * 5) / 9;
  const dewC = ((dewF - 32) * 5) / 9;
  return Math.round(
    100 *
      (Math.exp((17.625 * dewC) / (243.04 + dewC)) /
        Math.exp((17.625 * tempC) / (243.04 + tempC)))
  );
}
function detectAnomalies(latest: WeatherPoint): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const windSpeed = Math.sqrt(latest.wind_x ** 2 + latest.wind_y ** 2);
  const heatIndex = latest.temperature + 0.33 * latest.dewpoint - 4;

  if (latest.temperature > 100 || heatIndex > 105) {
    anomalies.push({
      type: "Heat",
      point: latest,
      description: `Heat alert! Temperature: ${
        latest.temperature
      }°F, Heat index: ${Math.round(heatIndex)}°F`,
    });
  } else if (latest.temperature < 32) {
    anomalies.push({
      type: "Cold",
      point: latest,
      description: `Cold alert! Temperature: ${latest.temperature}°F`,
    });
  }

  if (windSpeed > 50) {
    anomalies.push({
      type: "High Wind",
      point: latest,
      description: `High wind alert! Speed: ${Math.round(windSpeed)} mph`,
    });
  }

  if (latest.precip > 1) {
    anomalies.push({
      type: "Precipitation",
      point: latest,
      description: `Heavy precipitation! ${latest.precip} in/hr`,
    });
  }

  return anomalies;
}

export default Modal;
