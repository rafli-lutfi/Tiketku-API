'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Order, {as:"order", foreignKey: "order_id"})
    }
  }
  Payment.init({
    order_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};