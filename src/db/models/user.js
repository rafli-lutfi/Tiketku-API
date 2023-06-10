'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Order, {as: "order_contact", foreignKey: "user_id"})
      User.belongsTo(models.Role, {as: "role", foreignKey: "role_id"})
    }
  }
  User.init({
    role_id: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};