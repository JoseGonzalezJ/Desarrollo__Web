import express from 'express';
import cors from 'cors';
import sensorRoutes from './routes/sensorRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/sensors', sensorRoutes);

export default app;