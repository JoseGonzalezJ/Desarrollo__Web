import { sequelize } from './SequelizeConfig.js';
import { DataTypes } from 'sequelize';

export const SensorModel = sequelize.define('Sensor', {
  tipo: { type: DataTypes.STRING, allowNull: false },
  valor: { type: DataTypes.FLOAT, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});
