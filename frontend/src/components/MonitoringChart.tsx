// MonitoringChart.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, FlaskConical, Gauge } from "lucide-react";
import { SidebarIcon } from "./SidebarIcon";
import { seaStormColors } from "../utils/colors";

interface SensorData {
  temperature: string;
  humidity: string;
  ph: string;
  nutrients: string;
}

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  ph: number;
  nutrients: number;
}

const metrics = [
  { id: "humidity", label: "Humidity", icon: Droplets, color: seaStormColors.blue.light },
  { id: "temperature", label: "Temperature", icon: Thermometer, color: seaStormColors.blue.medium },
  { id: "ph", label: "pH Level", icon: Gauge, color: seaStormColors.teal.light },
  { id: "nutrients", label: "Nutrients", icon: Gauge, color: seaStormColors.teal.medium },
] as const;

type MetricId = (typeof metrics)[number]["id"];

const MAX_DATA_POINTS = 30;

const safeParseFloat = (value: string) => {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : 0;
};

export function MonitoringChart({ sensorData }: { sensorData: SensorData }) {
  const [activeMetric, setActiveMetric] = useState<MetricId>("humidity");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const updateChartData = useCallback((newData: SensorData) => {
    const newDataPoint: ChartData = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      temperature: safeParseFloat(newData.temperature),
      humidity: safeParseFloat(newData.humidity),
      ph: safeParseFloat(newData.ph),
      nutrients: safeParseFloat(newData.nutrients),
    };

    setChartData(prevData => {
      const newData = [...prevData, newDataPoint];
      return newData.length > MAX_DATA_POINTS ? newData.slice(-MAX_DATA_POINTS) : newData;
    });
  }, []);

  useEffect(() => {
    updateChartData(sensorData);
  }, [sensorData, updateChartData]);

  const currentMetric = metrics.find((m) => m.id === activeMetric) ?? metrics[0];

  const getYDomain = () => {
    const domains: Record<MetricId, [number, number]> = {
      humidity: [0, 100],
      temperature: [0, 40],
      ph: [0, 14],
      nutrients: [0, 100],
    };
    return domains[activeMetric] ?? [0, 100];
  };

  const sidebarIcons = useMemo(() => (
    metrics.map((metric) => (
      <SidebarIcon
        key={metric.id}
        icon={metric.icon}
        label={metric.label}
        isActive={activeMetric === metric.id}
        onClick={() => setActiveMetric(metric.id)}
        color={metric.color}
      />
    ))
  ), [activeMetric]);

  return (
    <div className="flex gap-4 h-[400px]">
      <div className="flex flex-col gap-2 p-2 rounded-lg shadow-md bg-white">
        {sidebarIcons}
      </div>

      <Card className="flex-1 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Real-time {currentMetric.label} Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={seaStormColors.sand.medium} />
              <XAxis dataKey="time" stroke={seaStormColors.blue.light} tick={{ fill: seaStormColors.blue.light }} />
              <YAxis stroke={seaStormColors.blue.light} tick={{ fill: seaStormColors.blue.light }} domain={getYDomain()} />
              <Tooltip contentStyle={{ backgroundColor: seaStormColors.cardBg, border: `1px solid ${seaStormColors.sand.medium}`, borderRadius: "8px" }} />
              <Line type="monotone" dataKey={activeMetric} stroke={currentMetric.color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} animationDuration={300} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}