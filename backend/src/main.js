import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, { 
  cors: { origin: process.env.CORS_ORIGIN || '*' } 
});

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

console.log('Servidor iniciado. Esperando conexiones...');

// Simulador de datos con manejo de errores
setInterval(() => {
  try {
    const data = {
      temperature: Number((20 + Math.random() * 5).toFixed(2)),
      humidity: Number((50 + Math.random() * 20).toFixed(2)),
      ph: Number((6 + Math.random() * 1.5).toFixed(2)),
      nutrients: Number((70 + Math.random() * 10).toFixed(2)),
    };
    io.emit('sensorData', data);
  } catch (error) {
    console.error('Error al generar datos del sensor:', error);
  }
}, 3000);

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Manejo de cierre del servidor
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  io.close(() => console.log('Socket.io cerrado.'));
  server.close(() => {
    console.log('Servidor Express cerrado.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
