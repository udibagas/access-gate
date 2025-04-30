"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Readers", [
      {
        name: "READER IN",
        prefix: "W",
        type: "IN",
        GateId: 1,
      },
      {
        name: "READER OUT",
        prefix: "X",
        type: "OUT",
        GateId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Readers", null, {});
  },
};
