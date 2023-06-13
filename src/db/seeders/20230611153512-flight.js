const moment = require("moment")
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawJKT_SUB = require("./data/flight-JKT-SUB.json")
    const rawSUB_JKT = require("./data/flight-SUB-JKT.json")
    const JKT_SUB = rawJKT_SUB.map(flight => {
      return {
        ...flight,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    const SUB_JKT = rawSUB_JKT.map(flight => {
      return {
        ...flight,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    await queryInterface.bulkInsert('Flights', [...JKT_SUB, ...SUB_JKT], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Flights', null, {});
  }
};
