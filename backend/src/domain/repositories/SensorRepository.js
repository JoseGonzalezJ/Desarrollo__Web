import { SensorModel } from '../../infrastructure/database/index.js';

export class SensorRepository {
  async create(sensor) {
    return SensorModel.create(sensor);
  }

  async findAll() {
    return SensorModel.findAll();
  }
}