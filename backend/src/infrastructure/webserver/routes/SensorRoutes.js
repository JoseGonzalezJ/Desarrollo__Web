import express from 'express';
import { SensorService } from '../../../application/services/SensorService.js';
import { SensorRepository } from '../../../domain/repositories/SensorRepository.js';

const router = express.Router();
const sensorRepository = new SensorRepository();
const sensorService = new SensorService(sensorRepository);

router.get('/', async (req, res) => {
  const sensors = await sensorService.getAllSensors();
  res.json(sensors);
});

router.post('/', async (req, res) => {
  const { tipo, valor } = req.body;
  const newSensor = { tipo, valor, fecha: new Date() };
  const sensor = await sensorService.addSensor(newSensor);
  res.status(201).json(sensor);
});

export default router;