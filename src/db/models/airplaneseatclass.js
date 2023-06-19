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
      AirplaneSeatClass.belongsTo(models.Airplane, {as:"airplane", foreignKey:"airplane_id"})
    }
  }
  AirplaneSeatClass.init({
    airplane_id: DataTypes.INTEGER,
    seat_type: DataTypes.STRING,
    total_seat: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'AirplaneSeatClass',
  });
  return AirplaneSeatClass;
};