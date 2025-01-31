import { SensorData } from "../domain/models/Sensor";

export interface SensorApi {
  subscribeToSensorData: (callback: (data: SensorData) => void) => void;
}