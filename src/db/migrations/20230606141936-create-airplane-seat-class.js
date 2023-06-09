'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AirplaneSeatClasses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airplane_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Airplanes",
          key: "id",
          as: "airplane_id"
        }
      },
      seat_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total_seat: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AirplaneSeatClasses');
  }
};