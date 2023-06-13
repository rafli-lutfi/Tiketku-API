'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Flight.belongsTo(models.Airplane, {as:"airplane", foreignKey: "airplane_id"})
      Flight.belongsTo(models.Airport, {as:"departure_airport", foreignKey: "departure_airport_id"})
      Flight.belongsTo(models.Airport, {as:"arrival_airport", foreignKey: "arrival_airport_id"})
      Flight.hasMany(models.Price, {as:"prices", foreignKey: "flight_id"})
      Flight.hasMany(models.Order, {as: "orders", foreignKey: "flight_id"})
    }
  }
  Flight.init({
    airplane_id: DataTypes.INTEGER,
    airline_id: DataTypes.INTEGER,
    airport_departure_id: DataTypes.INTEGER,
    airport_arrival_id: DataTypes.INTEGER,
    flight_number: DataTypes.String,
    price: DataTypes.DOUBLE,
    date: DataTypes.DATEONLY,
    departure_time: DataTypes.DATE,
    arrival_time: DataTypes.DATE,
    duration: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};