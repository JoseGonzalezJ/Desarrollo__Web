// src/ui/pages/Dashboard.tsx

// src/ui/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { MetricCard } from "../components/MetricCard";
import { MonitoringChart } from "../components/MonitoringChart";
import { seaStormColors } from "../../utils/colors";
import { AxiosSensorApi } from "../../adapters/AxiosSensorApi";
import { SensorData, Thresholds } from "../../domain/models/Sensor";
import { Bell, AlertTriangle } from "lucide-react";
import { MushroomSelector } from "../components/mushroom-selector";
import { Fungus } from "../../domain/models/Fungus";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  type: "warning" | "critical";
}

// Umbrales iniciales (pueden ser sobrescritos por los valores del hongo seleccionado)
const initialThresholds: Record<keyof SensorData, Thresholds> = {
  humidity: {
    warning: { min: 60, max: 80 },
    critical: { min: 50, max: 90 },
  },
  temperature: {
    warning: { min: 18, max: 28 },
    critical: { min: 15, max: 30 },
  },
  ph: {
    warning: { min: 5.5, max: 7.5 },
    critical: { min: 5, max: 8 },
  },
  nutrients: {
    warning: { min: 60, max: 80 },
    critical: { min: 50, max: 90 },
  },
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: "0",
    humidity: "0",
    ph: "0",
    nutrients: "0",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentAlerts, setCurrentAlerts] = useState<string[]>([]);
  const [selectedMushroom, setSelectedMushroom] = useState<string | null>(null);
  const [mushroomThresholds, setMushroomThresholds] = useState<Record<string, Record<keyof SensorData, Thresholds>>>({});

  // Función para calcular los umbrales basados en los valores óptimos del hongo
  const calculateThresholds = (fungus: Fungus): Record<keyof SensorData, Thresholds> => {
    return {
      humidity: {
        warning: {
          min: fungus.optimalHumidity - fungus.optimalHumidity * 0.1,
          max: fungus.optimalHumidity + fungus.optimalHumidity * 0.1,
        },
        critical: {
          min: fungus.optimalHumidity - fungus.optimalHumidity * 0.2,
          max: fungus.optimalHumidity + fungus.optimalHumidity * 0.2,
        },
      },
      temperature: {
        warning: {
          min: fungus.optimalTemperature - fungus.optimalTemperature * 0.1,
          max: fungus.optimalTemperature + fungus.optimalTemperature * 0.1,
        },
        critical: {
          min: fungus.optimalTemperature - fungus.optimalTemperature * 0.2,
          max: fungus.optimalTemperature + fungus.optimalTemperature * 0.2,
        },
      },
      ph: {
        warning: {
          min: fungus.optimalPH - fungus.optimalPH * 0.1,
          max: fungus.optimalPH + fungus.optimalPH * 0.1,
        },
        critical: {
          min: fungus.optimalPH - fungus.optimalPH * 0.2,
          max: fungus.optimalPH + fungus.optimalPH * 0.2,
        },
      },
      nutrients: {
        warning: {
          min: fungus.nutrients - fungus.nutrients * 0.1,
          max: fungus.nutrients + fungus.nutrients * 0.1,
        },
        critical: {
          min: fungus.nutrients - fungus.nutrients * 0.2,
          max: fungus.nutrients + fungus.nutrients * 0.2,
        },
      },
    };
  };

  // Efecto para actualizar los umbrales cuando se selecciona un hongo
  useEffect(() => {
    if (selectedMushroom) {
      // Aquí deberías obtener los datos del hongo seleccionado desde tu API o base de datos
      const selectedFungus: Fungus = {
        id: 1,
        name: selectedMushroom,
        optimalHumidity: 80, // Ejemplo: valor óptimo de humedad
        optimalPH: 6.5, // Ejemplo: valor óptimo de pH
        optimalTemperature: 25, // Ejemplo: valor óptimo de temperatura
        nutrients: 70, // Ejemplo: valor óptimo de nutrientes
      };

      const newThresholds = calculateThresholds(selectedFungus);
      setMushroomThresholds((prev) => ({
        ...prev,
        [selectedMushroom]: newThresholds,
      }));
    }
  }, [selectedMushroom]);

  useEffect(() => {
    const unsubscribe = AxiosSensorApi.subscribeToSensorData((data) => {
      setSensorData(data);
      if (selectedMushroom && mushroomThresholds[selectedMushroom]) {
        checkThresholdsAndNotify(data, mushroomThresholds[selectedMushroom]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedMushroom, mushroomThresholds]);

  const checkThresholdsAndNotify = (data: SensorData, thresholds: Record<keyof SensorData, Thresholds>) => {
    const newAlerts: string[] = [];
    const newNotifications: Notification[] = [];

    Object.entries(data).forEach(([key, value]) => {
      const numValue = Number.parseFloat(value);
      const metric = key as keyof SensorData;
      if (numValue < thresholds[metric].critical.min || numValue > thresholds[metric].critical.max) {
        const message = `${key.charAt(0).toUpperCase() + key.slice(1)} critically out of range`;
        newAlerts.push(message);
        newNotifications.push(createNotification(message, "critical"));
      } else if (numValue < thresholds[metric].warning.min || numValue > thresholds[metric].warning.max) {
        const message = `${key.charAt(0).toUpperCase() + key.slice(1)} outside optimal range`;
        newAlerts.push(message);
        newNotifications.push(createNotification(message, "warning"));
      }
    });

    setCurrentAlerts(newAlerts);
    setNotifications((prev) => [...newNotifications, ...prev]);
  };

  const createNotification = (message: string, type: "warning" | "critical"): Notification => ({
    id: Date.now(),
    message,
    timestamp: new Date().toLocaleTimeString(),
    type,
  });

  return (
    <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: seaStormColors.background }}>
      <header className="flex h-16 items-center px-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: seaStormColors.blue.dark }}>
          Mushroom Monitoring System
        </h1>
        <MushroomSelector
          selectedMushroom={selectedMushroom || ""}
          onSelectMushroom={(mushroom) => setSelectedMushroom(mushroom)}
        />
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(sensorData).map(([key, value]) => {
            const thresholdsForMetric = selectedMushroom
              ? mushroomThresholds[selectedMushroom]?.[key as keyof SensorData] || initialThresholds[key as keyof SensorData]
              : initialThresholds[key as keyof SensorData];

            return (
              <MetricCard
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                value={Number.parseFloat(value)}
                unit={key === "temperature" ? "°C" : "%"}
                thresholds={thresholdsForMetric} // Asegúrate de que thresholds siempre tenga un valor válido
              />
            );
          })}
        </div>

        <MonitoringChart sensorData={sensorData} />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Last Update</span><span>Just now</span></div>
                <div className="flex justify-between"><span>Sensors Status</span><span>All Operating</span></div>
                <div className="flex justify-between"><span>Next Maintenance</span><span>3 days</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Current Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentAlerts.length === 0 ? (
                  <div className="p-2 rounded border">All parameters within normal range</div>
                ) : (
                  currentAlerts.map((alert, index) => (
                    <div key={index} className="p-2 rounded border flex items-center space-x-2">
                      <AlertTriangle size={16} />
                      <span>{alert}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center">No notifications yet</div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-2 p-2 rounded border">
                      <Bell size={16} />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}