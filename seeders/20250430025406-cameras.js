"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Cameras", [
      {
        name: "KAMERA IN",
        url: "http://192.168.1.108/cgi-bin/snapshot.cgi",
        user: "admin",
        password: "admin123",
      },
      {
        name: "KAMERA OUT",
        url: "http://192.168.1.108/cgi-bin/snapshot.cgi",
        user: "admin",
        password: "admin123",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Cameras", null, {});
  },
};
