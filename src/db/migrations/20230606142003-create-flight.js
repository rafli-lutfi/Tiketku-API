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
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: "Airplanes",
          key: "id",
          as: "airplane_id"
        }
      },
      departure_airport_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Airports",
          key: "id",
          as: "departure_airport_id"
        }
      },
      arrival_airport_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Airports",
          key: "id",
          as: "arrival_airport_id"
        }
      },
      flight_number: {
        type: Sequelize.STRING
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      departure_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      arrival_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      duration: {
        allowNull: false,
        type: Sequelize.TIME
      },
      free_baggage: {
        type: Sequelize.INTEGER,
      },
      cabin_baggage: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
      .then(() => queryInterface.addIndex('Flights', ['departure_airport_id']))
      .then(() => queryInterface.addIndex('Flights', ['arrival_airport_id']))
      .then(() => queryInterface.addIndex('Flights', ['date']))
      .then(() => queryInterface.addIndex('Flights', ['departure_time']));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Flights');
  }
};