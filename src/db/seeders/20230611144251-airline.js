'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Airlines', [
      {
        name: 'Batik Air',
        airline_iata: "ID",
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Citilink',
        airline_iata: "QG",
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Garuda Indonesia',
        airline_iata: "GA",
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lion Air',
        airline_iata: "JT",
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airlines', null, {});
  }
};
