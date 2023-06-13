'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airplane.belongsTo(models.Airline, {as: "airline", foreignKey:"airline_id"})
      Airplane.hasMany(models.AirplaneSeatClass, {as: "seat_classes", foreignKey: "airplane_id"})
      Airplane.hasMany(models.Flight, {as: "flights", foreignKey: "airplane_id"})
    }
  }
  Airplane.init({
    airline_id: DataTypes.INTEGER,
    model: DataTypes.STRING,
    code: DataTypes.STRING,
    capacity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Airplane',
  });
  return Airplane;
};