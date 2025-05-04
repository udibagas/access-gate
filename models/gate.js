"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Gate extends Model {
    static associate(models) {
      // define association here
    }
  }

  Gate.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama gate harus diisi" },
          notNull: { msg: "Nama gate harus diisi" },
        },
      },
      device: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Device sudah terdaftar" },
        validate: {
          notEmpty: { msg: "Device harus diisi" },
          notNull: { msg: "Device harus diisi" },
        },
      },
    },
    {
      sequelize,
      modelName: "Gate",
      timestamps: false,
    }
  );

  return Gate;
};
