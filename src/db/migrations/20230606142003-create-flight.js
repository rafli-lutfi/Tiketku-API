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
      airlane_id: {
        type: Sequelize.INTEGER
      },
      from_airport_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Airports",
          key: "id",
          as: "from_airport_id"
        }
      },
      to_airport_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Airports",
          key: "id",
          as: "to_airport_id"
        }
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      departure_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      arrival_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      estimation: {
        allowNull: false,
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