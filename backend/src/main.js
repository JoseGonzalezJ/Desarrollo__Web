import 'dotenv/config';
import express from 'express';
import { sequelize } from './infrastructure/database/SequelizeConfig.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SensorService } from './application/services/SensorService.js';
import { SensorRepository } from './domain/repositories/SensorRepository.js';
import app from './infrastructure/webserver/express.js'; // Importa la instancia de Express
import authRoutes from './infrastructure/webserver/routes/AuthRoutes.js'; // Importa rutas de autenticación

// 🔹 Configuración de CORS (Debe ir antes de las rutas)
const corsOptions = {
  origin: "http://localhost:5173", // Permitir solicitudes desde el frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Permitir cookies y headers de autorización
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Manejar preflight requests

// Middleware para manejar JSON en las solicitudes
app.use(express.json());

// 🔹 Registrar rutas de autenticación (después de CORS)
app.use('/api/auth', authRoutes);

// 🔹 Crear el servidor HTTP con Express
const server = createServer(app);

// 🔹 Configurar WebSockets con permisos de CORS
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// 🔹 Inicializar el servicio de sensores
const sensorRepository = new SensorRepository();
const sensorService = new SensorService(sensorRepository);

// 🔹 Simulador de datos de sensores
setInterval(async () => {
  try {
    const data = {
      temperature: Number((20 + Math.random() * 5).toFixed(2)),
      humidity: Number((50 + Math.random() * 20).toFixed(2)),
      ph: Number((6 + Math.random() * 1.5).toFixed(2)),
      nutrients: Number((70 + Math.random() * 10).toFixed(2)),
    };

    // Emitir los datos a los clientes conectados
    io.emit('sensorData', data);
  } catch (error) {
    console.error('Error al generar o guardar datos del sensor:', error);
  }
}, 3000);

// 🔹 Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// 🔹 Manejo de cierre del servidor
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  io.close(() => console.log('Socket.io cerrado.'));
  server.close(() => {
    console.log('Servidor Express cerrado.');
    process.exit(0);
  });
});

// 🔹 Sincronizar base de datos y levantar el servidor
sequelize.sync().then(() => {
  console.log("Base de datos conectada");
  server.listen(4000, () => console.log("Servidor corriendo en puerto 4000"));
}).catch((err) => console.error("Error al conectar la base de datos:", err));

