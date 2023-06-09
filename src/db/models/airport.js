'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airport.hasMany(models.Flight, {as: "flight_origin", foreignKey: "departure_airport_id"})
      Airport.hasMany(models.Flight, {as: "flight_destination", foreignKey: "arrival_airport_id"})
    }
  }
  Airport.init({
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    airport_iata: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airport',
  });
  return Airport;
};