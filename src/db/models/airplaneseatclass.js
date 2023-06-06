'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AirplaneSeatClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AirplaneSeatClass.init({
    airplane_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    seat_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AirplaneSeatClass',
  });
  return AirplaneSeatClass;
};