'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passenger.belongsTo(models.Order, {as: "order", foreignKey: "order_id"})
    }
  }
  Passenger.init({
    order_id: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    age_group: DataTypes.STRING,
    title: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    nationality: DataTypes.STRING,
    ktp: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};