// Dashboard.tsx
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "../components/MetricCard"
import { MonitoringChart } from "../components/MonitoringChart"
import { seaStormColors } from "../utils/colors"
import socket from "../utils/socket"

interface SensorData {
  temperature: string
  humidity: string
  ph: string
  nutrients: string
}

// Componente reutilizable para mensajes de alerta
function AlertMessage({ message, bgColor, borderColor, textColor }: { message: string; bgColor: string; borderColor: string; textColor: string }) {
  return (
    <div
      className="p-2 rounded border"
      style={{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }}
    >
      {message}
    </div>
  )
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: "0",
    humidity: "0",
    ph: "0",
    nutrients: "0",
  })

  const isSubscribed = useRef(false) // Evita múltiples suscripciones al socket

  useEffect(() => {
    if (!isSubscribed.current) {
      socket.on("sensorData", (data: SensorData) => setSensorData(data))
      isSubscribed.current = true
    }

    return () => {
      socket.off("sensorData")
      isSubscribed.current = false
    }
  }, [])

  // Convertimos los valores numéricos una sola vez
  const parsedData = {
    temperature: Number.parseFloat(sensorData.temperature),
    humidity: Number.parseFloat(sensorData.humidity),
    ph: Number.parseFloat(sensorData.ph),
    nutrients: Number.parseFloat(sensorData.nutrients),
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden" style={{ backgroundColor: seaStormColors.background }}>
      {/* Header */}
      <header
        className="flex h-16 shrink-0 items-center px-6 border-b bg-white shadow-sm"
        style={{ borderColor: seaStormColors.sand.medium }}
      >
        <h1 className="text-2xl font-bold" style={{ color: seaStormColors.blue.dark }}>
          Mushroom Monitoring System
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard title="Humidity" value={parsedData.humidity} unit="%" status="optimal" />
          <MetricCard title="Temperature" value={parsedData.temperature} unit="°C" status="optimal" />
          <MetricCard title="pH Level" value={parsedData.ph} unit="pH" status="warning" />
          <MetricCard title="Soil Nutrients" value={parsedData.nutrients} unit="%" status="optimal" />
        </div>

        {/* Monitoring Chart */}
        <MonitoringChart sensorData={sensorData} />

        {/* Additional Information */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* System Status */}
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

          {/* Alerts */}
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
  )
}
