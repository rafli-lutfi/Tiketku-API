'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Airports', [
      {
        name: "Soekarno Hatta",
        city: 'Jakarta',
        country: "Indonesia",
        airport_iata: "CGK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Juanda",
        city: 'Surabaya',
        country: "Indonesia",
        airport_iata: "SUB",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Minangkabau International Airport",
        city: 'Padang',
        country: "Indonesia",
        airport_iata: "PDG",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ngurah Rai",
        city: 'Bali',
        country: "Indonesia",
        airport_iata: "DPS",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Sultan Hassanudin",
        city: 'Makassar',
        country: "Indonesia",
        airport_iata: "UPG",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {		
        name: "Jalaluddin",
        city: 'Gorontalo',
        country: "Indonesia",
        airport_iata: "GTO",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {	
        name: "Sultan Mahmud Badaruddin II",
        city: 'Palembang',
        country: "Indonesia",
        airport_iata: "PLM",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lombok Praya International Airport",
        city: 'Lombok',
        country: "Indonesia",
        airport_iata: "LOP",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airports', null, {});
  }
};
