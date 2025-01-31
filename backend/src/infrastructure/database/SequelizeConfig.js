import { Sequelize } from 'sequelize';
import { readFile } from 'fs/promises';

// Asegúrate de usar la ruta correcta
const config = JSON.parse(
  await readFile(new URL('../../config/config.json', import.meta.url))
);


const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
