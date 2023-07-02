'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Airlines', [
      {
        name: 'Batik Air',
        airline_iata: "ID",
        logo: "https://ik.imagekit.io/tvlk/image/imageResource/2019/12/13/1576208649600-12471f9b7ffa159361f7bbbfb63065ee.png?tr=q-75",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Citilink',
        airline_iata: "QG",
        logo: "https://ik.imagekit.io/tvlk/image/imageResource/2015/12/17/1450350561012-6584b693edd67d75cfc25ecff41c5704.png?tr=q-75",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Garuda Indonesia',
        airline_iata: "GA",
        logo: "https://ik.imagekit.io/tvlk/image/imageResource/2019/12/12/1576140134467-906ded3638e9045d664adc40caa8ec47.png?tr=q-75",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lion Air',
        airline_iata: "JT",
        logo: "https://ik.imagekit.io/tvlk/image/imageResource/2015/12/17/1450349861201-09ec8f298222a73d66e8e96aa3b918f0.png?tr=q-75",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airlines', null, {});
  }
};
