// src/adapters/AxiosSensorApi.ts
import { io } from "socket.io-client";
import { SensorApi } from "../ports/SensorApi";

// Asegúrate de que la URL sea correcta (debe ser el mismo puerto y servidor de backend)
const socket = io("http://localhost:4000");

export const AxiosSensorApi: SensorApi = {
  subscribeToSensorData: (callback) => {
    socket.on("sensorData", callback);
    
    // Retornamos una función de desuscripción
    return () => {
      socket.off("sensorData", callback);
    };
  },
};
