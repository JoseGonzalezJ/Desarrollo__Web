export class SensorService {
    constructor(sensorRepository) {
      this.sensorRepository = sensorRepository;
    }
    async addSensor(sensor) {
      return this.sensorRepository.create(sensor);
    }
    async getAllSensors() {
      return this.sensorRepository.findAll();
    }
  }
  