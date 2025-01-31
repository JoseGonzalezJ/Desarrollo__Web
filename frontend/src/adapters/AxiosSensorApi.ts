import { io } from "socket.io-client";
import { SensorApi } from "../ports/SensorApi";

const socket = io("http://localhost:4000");

export const AxiosSensorApi: SensorApi = {
  subscribeToSensorData: (callback) => {
    socket.on("sensorData", callback);
  },
};