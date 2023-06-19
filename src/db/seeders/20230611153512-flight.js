const moment = require("moment")
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {flights: rawFlights} = require("./data/data.json")

    const flights = rawFlights.map(flight => {
      return {
        ...flight,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    await queryInterface.bulkInsert('Flights', flights, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Flights', null, {});
  }
};
