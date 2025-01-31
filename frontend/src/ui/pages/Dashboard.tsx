import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { MetricCard } from "../components/MetricCard";
import { MonitoringChart } from "../components/MonitoringChart";
import { seaStormColors } from "../../utils/colors";
import { AxiosSensorApi } from "../../adapters/AxiosSensorApi";
import { AlertMessage } from "../components/ui/AlertMessage"; 

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    temperature: "0",
    humidity: "0",
    ph: "0",
    nutrients: "0",
  });

  const isSubscribed = useRef(false);

  useEffect(() => {
    if (!isSubscribed.current) {
      AxiosSensorApi.subscribeToSensorData((data) => setSensorData(data));
      isSubscribed.current = true;
    }

    return () => {
      isSubscribed.current = false;
    };
  }, []);

  const parsedData = {
    temperature: Number.parseFloat(sensorData.temperature),
    humidity: Number.parseFloat(sensorData.humidity),
    ph: Number.parseFloat(sensorData.ph),
    nutrients: Number.parseFloat(sensorData.nutrients),
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden" style={{ backgroundColor: seaStormColors.background }}>
      <header className="flex h-16 shrink-0 items-center px-6 border-b bg-white shadow-sm" style={{ borderColor: seaStormColors.sand.medium }}>
        <h1 className="text-2xl font-bold" style={{ color: seaStormColors.blue.dark }}>
          Mushroom Monitoring System
        </h1>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard title="Humidity" value={parsedData.humidity} unit="%" status="optimal" />
          <MetricCard title="Temperature" value={parsedData.temperature} unit="°C" status="optimal" />
          <MetricCard title="pH Level" value={parsedData.ph} unit="pH" status="warning" />
          <MetricCard title="Soil Nutrients" value={parsedData.nutrients} unit="%" status="optimal" />
        </div>

        <MonitoringChart sensorData={sensorData} />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-lg" style={{ backgroundColor: seaStormColors.cardBg, borderColor: seaStormColors.sand.medium }}>
            <CardHeader>
              <CardTitle style={{ color: seaStormColors.blue.dark }}>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" style={{ color: seaStormColors.blue.medium }}>
                <div className="flex justify-between">
                  <span>Last Update</span>
                  <span>Just now</span>
                </div>
                <div className="flex justify-between">
                  <span>Sensors Status</span>
                  <span style={{ color: seaStormColors.teal.medium }}>All Operating</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Maintenance</span>
                  <span>3 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg" style={{ backgroundColor: seaStormColors.cardBg, borderColor: seaStormColors.sand.medium }}>
            <CardHeader>
              <CardTitle style={{ color: seaStormColors.blue.dark }}>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {parsedData.ph > 7 && (
                  <AlertMessage
                    message="pH levels slightly above optimal range"
                    bgColor={seaStormColors.sand.light}
                    borderColor={seaStormColors.sand.darker}
                    textColor={seaStormColors.blue.dark}
                  />
                )}
                <AlertMessage
                  message="All other parameters within normal range"
                  bgColor={`${seaStormColors.teal.light}15`}
                  borderColor={seaStormColors.teal.light}
                  textColor={seaStormColors.teal.dark}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}