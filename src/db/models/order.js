'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    flight_id: DataTypes.INTEGER,
    price_id: DataTypes.INTEGER,
    payment_id: DataTypes.INTEGER,
    booking_code: DataTypes.STRING,
    total_passengers: DataTypes.INTEGER,
    total_price: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    paid_before: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};