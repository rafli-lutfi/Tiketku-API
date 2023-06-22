'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {prices: rawPrices} = require("./data/June-Dec-2023.json")

    const prices = rawPrices.map(price => {
      return {
        ...price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    
    await queryInterface.bulkInsert('Prices', prices, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Prices', null, {});
  }
};
