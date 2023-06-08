'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Price.belongsTo(models.Flight, {as: "flight_price", foreignKey: "flight_id"})
    }
  }
  Price.init({
    flight_id: DataTypes.INTEGER,
    seat_type: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    discount: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};