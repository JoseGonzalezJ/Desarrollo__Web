import { SensorData } from "../models/Sensor";

export class SensorService {
  parseSensorData(data: SensorData) {
    return {
      temperature: Number.parseFloat(data.temperature),
      humidity: Number.parseFloat(data.humidity),
      ph: Number.parseFloat(data.ph),
      nutrients: Number.parseFloat(data.nutrients),
    };
  }
}
