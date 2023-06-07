'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "user_id"
        }
      },
      flight_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Flights",
          key: "id",
          as: "flight_id"
        }
      },
      price_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Prices",
          key: "id",
          as: "price_id"
        }
      },
      payment_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Payments",
          key: "id",
          as: "payment_id"
        }
      },
      booking_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total_passengers: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total_price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      paid_before: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Orders');
  }
};