import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export const subscribeToSensorData = (callback) => {
  socket.on("sensorData", callback);
};