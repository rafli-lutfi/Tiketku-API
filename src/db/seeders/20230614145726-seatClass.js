'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('AirplaneSeatClasses', [
      {
        airplane_id: 1,
        seat_type: "ECONOMY",
        total_seat: 160,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 1,
        seat_type: "BUSINESS",
        total_seat: 32,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 2,
        seat_type: "ECONOMY",
        total_seat: 160,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 2,
        seat_type: "BUSINESS",
        total_seat: 32,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 3,
        seat_type: "ECONOMY",
        total_seat: 160,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 3,
        seat_type: "BUSINESS",
        total_seat: 26,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 4,
        seat_type: "ECONOMY",
        total_seat: 112,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 5,
        seat_type: "ECONOMY",
        total_seat: 124,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 6,
        seat_type: "ECONOMY",
        total_seat: 174,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 7,
        seat_type: "ECONOMY",
        total_seat: 174,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 8,
        seat_type: "ECONOMY",
        total_seat: 186,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 9,
        seat_type: "ECONOMY",
        total_seat: 192,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 10,
        seat_type: "ECONOMY",
        total_seat: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 10,
        seat_type: "BUSINESS",
        total_seat: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 11,
        seat_type: "ECONOMY",
        total_seat: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 11,
        seat_type: "BUSINESS",
        total_seat: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 11,
        seat_type: "FIRST CLASS",
        total_seat: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 12,
        seat_type: "ECONOMY",
        total_seat: 180,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 13,
        seat_type: "ECONOMY",
        total_seat: 180,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        airplane_id: 14,
        seat_type: "ECONOMY",
        total_seat: 180,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AirplaneSeatClasses', null, {});
  }
};
