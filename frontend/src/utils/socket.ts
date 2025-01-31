import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  timeout: 20000,
});

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server");
});

socket.on("connect_error", (error) => {
  console.error("❌ WebSocket connection error:", error);
  if (typeof window !== "undefined") {
    alert("Connection lost. Trying to reconnect...");
  }
});

export default socket;
