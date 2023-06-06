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
    }
  }
  Flight.init({
    airplane_id: DataTypes.INTEGER,
    airlane_id: DataTypes.INTEGER,
    from_airpord_id: DataTypes.INTEGER,
    to_airpord_id: DataTypes.INTEGER,
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