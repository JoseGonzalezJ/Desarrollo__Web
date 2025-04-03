import { DataTypes } from "sequelize";
import { sequelize } from "../../infrastructure/database/SequelizeConfig.js"

const Fungus = sequelize.define("Fungus", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optimalHumidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  optimalPH: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  optimalTemperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  nutrients: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Fungus;
