module.exports = (sequelize, DataTypes) => {
  const Sensor = sequelize.define(
    'Sensor',
    {
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // No permitir valores vacíos
        },
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true, // Asegurar que sea un número
          min: 0, // Evitar valores negativos si no son válidos
        },
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Usar la fecha actual por defecto
      },
    },
    {
      timestamps: true, // Se mantienen `createdAt` y `updatedAt`
      underscored: true, // Usa `snake_case` en lugar de `camelCase`
    }
  );

  return Sensor;
};
