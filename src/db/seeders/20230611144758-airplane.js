'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Airplanes', [
      {
        airline_id: 1,
        model: 'Airbus A320',
        code: "AIRBUS-A320-32",
        capacity: 192,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 1,
        model: 'Boeing 737',
        code: "BOEING-737-32",
        capacity: 192,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 1,
        model: "Boeing 737 Next Generation",
        code: "BOEING-737-800-32",
        capacity: 186,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 2,
        model: 'ATR 72',
        code: "ATR-72-28",
        capacity: 112,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 2,
        model: 'ATR 72',
        code: "ATR-72-31",
        capacity: 124,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 2,
        model: 'Airbus A320',
        code: "AIRBUS-A320-29",
        capacity: 174,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 2,
        model: 'AIRBUS A320',
        code: "AIRBUS-A320-32",
        capacity: 174,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 3,
        model: 'Airbus A332',
        code: "AIRBUS-A332-31",
        capacity: 186,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 3,
        model: 'Boeing 737',
        code: "BOEING-737-31",
        capacity: 192,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 3,
        model: 'Boeing 737 Next Generation',
        code: "BOEING-737-800-31",
        capacity: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 3,
        model: 'Bombardier CRJ1000',
        code: "BOMBARDIER-CRJ-1000-31",
        capacity: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 4,
        model: 'Boeing 737',
        code: "BOEING-737-29",
        capacity: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 4,
        model: 'Boeing 737',
        code: "BOEING-737-31",
        capacity: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline_id: 4,
        model: 'Boeing 737 MAX',
        code: "BOEING-737-MAX-29",
        capacity: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airplanes', null, {});
  }
};
