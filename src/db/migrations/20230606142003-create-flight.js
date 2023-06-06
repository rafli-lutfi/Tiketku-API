'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airplane_id: {
        type: Sequelize.INTEGER
      },
      airlane_id: {
        type: Sequelize.INTEGER
      },
      from_airpord_id: {
        type: Sequelize.INTEGER
      },
      to_airpord_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      departure_time: {
        type: Sequelize.DATE
      },
      arrival_time: {
        type: Sequelize.DATE
      },
      estimation: {
        type: Sequelize.TIME
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
    await queryInterface.dropTable('Flights');
  }
};