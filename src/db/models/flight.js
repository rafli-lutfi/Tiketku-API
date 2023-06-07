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
      Flight.belongsTo(models.Airport, {as:"airport_departure", foreignKey: "from_airport_id"})
      Flight.belongsTo(models.Airport, {as:"airport_arrival", foreignKey: "to_airport_id"})
      Flight.hasMany(models.Price, {as:"prices", foreignKey: "flight_id"})
      Flight.hasMany(models.Order, {as: "orders", foreignKey: "flight_id"})
    }
  }
  Flight.init({
    airplane_id: DataTypes.INTEGER,
    airlane_id: DataTypes.INTEGER,
    from_airport_id: DataTypes.INTEGER,
    to_airport_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    departure_time: DataTypes.DATE,
    arrival_time: DataTypes.DATE,
    estimation: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};