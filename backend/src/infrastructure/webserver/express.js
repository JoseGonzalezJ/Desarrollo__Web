import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import SensorRoutes from "./routes/SensorRoutes.js";
import FungusRoutes from "./routes/FungusRoutes.js"; // Importar las rutas de hongos

const app = express();

// 🔹 Configurar CORS correctamente
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Manejo de preflight requests

// 🔹 Middleware para manejar JSON y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Registrar rutas después de configurar CORS
app.use("/api/auth", AuthRoutes);
app.use("/api/sensors", SensorRoutes);
app.use("/api/fungus", FungusRoutes); // Registrar las rutas de hongos

export default app;
