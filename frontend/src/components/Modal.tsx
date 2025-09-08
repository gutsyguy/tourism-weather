import { Station, StationData } from "@/types/station";
import { Anomaly, AnomalyType, WeatherPoint } from "@/types/weather";
import moment from "moment-timezone";
import { useEffect, useState } from "react";

const Modal = ({
  stationData,
  station,
  setStation,
  city,
  state,
  country,
}: {
  stationData: StationData;
  station: Station;
  setStation: React.Dispatch<React.SetStateAction<Station | null>>;
  city: string;
  state: string;
  country: string;
}) => {
  const [places, setPlaces] = useState<PlacesResponse | null>(null);
  const temperature =
    stationData.points[stationData.points.length - 1].temperature;

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

  const timezone = stationData.points[stationData.points.length - 1].timestamp;
  const currentTime = moment().tz(timezone).format("HH:mm");

  const windX = stationData.points[stationData.points.length - 1].wind_x;
  const windY = stationData.points[stationData.points.length - 1].wind_y;

  function calcWind(windX: number, windY: number) {
    const speed = Math.round(Math.sqrt(windX * windX + windY * windY)); // mph
    const dirDeg = ((Math.atan2(windY, windX) * 180) / Math.PI + 360) % 360;

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const dirIndex = Math.round(dirDeg / 45) % 8;

    return { speed, direction: directions[dirIndex] };
  }

  const wind = calcWind(windX, windY);

  function calcHumidity(tempF: number, dewF: number): number {
    const tempC = ((tempF - 32) * 5) / 9;
    const dewC = ((dewF - 32) * 5) / 9;
    const rh =
      100 *
      (Math.exp((17.625 * dewC) / (243.04 + dewC)) /
        Math.exp((17.625 * tempC) / (243.04 + tempC)));
    return Math.round(rh);
  }

  const dew = stationData.points[stationData.points.length - 1].dewpoint;

  const humidityLevel = calcHumidity(temperature, dew);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return;
    const fetchPlaces = async () => {
      try {
        const res = await fetch(`${url}/api/places/place`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            textQuery: `Tourist Attractions in ${city}, ${state}, ${country} to visit`,
          }),
        });
        if (res.ok) {
          const result = await res.json();
          console.log(result);
          console.log({
            textQuery: `Tourist Attractions in ${city}, ${state}, ${country} to visit in ${tempDescription}, ${humidityLevel} weather`,
          });
          setPlaces(result);
        } else {
          console.error("Failed to send data:", res.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlaces();
  }, [station, city]);
  function detectAnomalies(points: WeatherPoint[]): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const seenTypes = new Set<AnomalyType>();

    for (const p of points) {
      const windSpeed = Math.sqrt(p.wind_x ** 2 + p.wind_y ** 2);
      const heatIndex = p.temperature + 0.33 * p.dewpoint - 4; // simple approximation

      if (
        !seenTypes.has("Heat") &&
        !seenTypes.has("Cold") &&
        (p.temperature > 100 || heatIndex > 105)
      ) {
        anomalies.push({
          type: "Heat",
          point: p,
          description: `Heat alert! Temperature: ${
            p.temperature
          }°F, Heat index: ${Math.round(heatIndex)}°F`,
        });
        seenTypes.add("Heat");
      }

      if (
        !seenTypes.has("Cold") &&
        !seenTypes.has("Heat") &&
        p.temperature < 32
      ) {
        anomalies.push({
          type: "Cold",
          point: p,
          description: `Cold alert! Temperature: ${p.temperature}°F`,
        });
        seenTypes.add("Cold");
      }

      if (!seenTypes.has("High Wind") && windSpeed > 50) {
        anomalies.push({
          type: "High Wind",
          point: p,
          description: `High wind alert! Speed: ${Math.round(windSpeed)} mph`,
        });
        seenTypes.add("High Wind");
      }

      if (!seenTypes.has("Precipitation") && p.precip > 1) {
        anomalies.push({
          type: "Precipitation",
          point: p,
          description: `Heavy precipitation! ${p.precip} in/hr`,
        });
        seenTypes.add("Precipitation");
      }

      // Stop early if all types have been found
      if (seenTypes.size === 4) break;
    }

    return anomalies;
  }

  //   const anomolies = detectAnomalies(stationData.points);

  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    if (!stationData?.points?.length) return;

    const detected = detectAnomalies(stationData.points);
    setAnomalies(detected);
  }, [stationData]);

  return (
    <div
      style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
      className=" absolute top-0 right-0 w-[27rem] h-[100vh] bg-white p-4 z-[999]"
    >
      <div className="flex flex-row justify-between">
        <div>
          <h1 className=" font-semibold text-2xl">{city}</h1>
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
      <hr />
      <p>Humidity: {humidityLevel}</p>
      <p>
        Wind: {wind.speed} m/s, {wind.direction}
      </p>
      <p>Station Name: {station.station_name}</p>
      <p>Network: {station.station_network}</p>
      <p>Timezone: {station.timezone}</p>
      <div>
        {anomalies.map((anomoly, index) => (
          <div key={index}>
            <strong>{anomoly.description}:</strong>
          </div>
        ))}
      </div>
      <hr />
      <h2>Tourist Acitivities</h2>
      {places?.data.places.map((place, index) => (
        <li key={index}>{place.displayName.text}</li>
      ))}
      <button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setStation(null)}
      >
        Close
      </button>
    </div>
  );
};

export default Modal;
