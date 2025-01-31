'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Cargar configuración de forma segura
const configPath = path.join(__dirname, '../config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))[env];

const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(
      process.env.DB_NAME || config.database,
      process.env.DB_USER || config.username,
      process.env.DB_PASS || config.password,
      config
    );

try {
  sequelize.authenticate();
  console.log('Conexión a la base de datos establecida correctamente.');
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
}

fs.readdirSync(__dirname)
  .filter(file => 
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
