import { io } from "socket.io-client";

// Asegúrate de que la URL coincida con la del servidor backend
const socket = io("http://localhost:4000");

export const subscribeToSensorData = (callback) => {
  socket.on("sensorData", callback);
};
