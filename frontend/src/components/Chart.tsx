import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { Chart as ChartJS, ChartConfiguration } from "chart.js";
import moment from "moment-timezone";
import { StationData, Point } from "@/types/station";

interface WeatherChartProps {
  stationData: StationData;
  timezone: string;
  height?: number;
  width?: number;
}

const WeatherChart: React.FC<WeatherChartProps> = ({
  stationData,
  timezone,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS<
    "line",
    (number | null)[],
    string
  > | null>(null);

  // Always call hooks first
  const now = moment().tz(timezone);
  let pointsLast24h: Point[] = [];
  if (stationData?.points?.length) {
    pointsLast24h = stationData.points.filter((p: Point) =>
      moment(p.timestamp)
        .tz(timezone)
        .isAfter(now.clone().subtract(24, "hours"))
    );

    const MAX_POINTS = 50;
    if (pointsLast24h.length > MAX_POINTS) {
      const step = Math.ceil(pointsLast24h.length / MAX_POINTS);
      pointsLast24h = pointsLast24h.filter((_, idx) => idx % step === 0);
    }
  }

  const labels = pointsLast24h.map((p: Point) =>
    moment(p.timestamp).tz(timezone).format("HH:mm")
  );
  const temperatureData = pointsLast24h.map((p) => p.temperature);
  const windSpeedData = pointsLast24h.map((p) =>
    Math.sqrt(p.wind_x ** 2 + p.wind_y ** 2)
  );
  const precipitationData = pointsLast24h.map((p) => p.precip);

  useEffect(() => {
    if (!pointsLast24h.length) return; 
    if (chartInstance.current) chartInstance.current.destroy();

    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration<"line", (number | null)[], string> = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Temperature (°F)",
            data: temperatureData,
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.1)",
            tension: 0.2,
            fill: true,
            pointRadius: 3,
          },
          {
            label: "Wind Speed (mph)",
            data: windSpeedData,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.1)",
            tension: 0.2,
            fill: true,
            pointRadius: 3,
          },
          {
            label: "Precipitation (in/hr)",
            data: precipitationData,
            borderColor: "green",
            backgroundColor: "rgba(0,255,0,0.1)",
            tension: 0.2,
            fill: true,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          title: {
            display: true,
            text: `${stationData.station} Weather Trends (Last 24h)`,
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => labels[tooltipItems[0].dataIndex],
            },
          },
          legend: { display: true },
        },
        scales: {
          x: { display: true, title: { display: true, text: "Time" } },
          y: { display: true, title: { display: true, text: "Value" } },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [
    labels,
    temperatureData,
    windSpeedData,
    precipitationData,
    stationData.station,
  ]);

  if (!pointsLast24h.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No weather data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: 500, height: 300, margin: "0 auto" }}>
      <canvas ref={chartRef} width={500} height={300}></canvas>
    </div>
  );
};

export default WeatherChart;
