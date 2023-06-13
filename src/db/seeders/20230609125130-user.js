'use strict';
const bcrypt = require("bcrypt")
const {
  ADMIN1_PASSWORD = "123",
  ADMIN2_PASSWORD = "123",
  ADMIN3_PASSWORD = "123",
} = process.env

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
    {
      role_id: 1,
      fullname: "rafli lutfi",
      email: "rafli.lutfi1818@gmail.com",
      phone: "08123456789",
      password: bcrypt.hashSync(ADMIN1_PASSWORD, 12),
      avatar: "https://ik.imagekit.io/tiu0i2v9jz/Tiketku-API/avatar/default-avatar.png",
      email_verified: true,
      user_type: "basic",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role_id: 1,
      fullname: "syaifun nadhif",
      email: "syaifunnadhif@gmail.com",
      phone: "0812345678",
      password: bcrypt.hashSync(ADMIN2_PASSWORD, 12),
      avatar: "https://ik.imagekit.io/tiu0i2v9jz/Tiketku-API/avatar/default-avatar.png",
      email_verified: true,
      user_type: "basic",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role_id: 1,
      fullname: "hafizh ridho",
      email: "m.hafizhridho676@gmail.com",
      phone: "081234567",
      password: bcrypt.hashSync(ADMIN3_PASSWORD, 12),
      avatar: "https://ik.imagekit.io/tiu0i2v9jz/Tiketku-API/avatar/default-avatar.png",
      email_verified: true,
      user_type: "basic",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
