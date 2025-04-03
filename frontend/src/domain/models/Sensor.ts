// Define el modelo de Sensor
export interface SensorData {
  temperature: string;
  humidity: string;
  ph: string;
  nutrients: string;
}

export interface Thresholds {
  warning: { min: number; max: number };
  critical: { min: number; max: number };
}