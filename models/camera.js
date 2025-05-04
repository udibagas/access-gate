"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Camera extends Model {
    static associate(models) {
      // define association here
    }
  }

  Camera.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama harus diisi" },
          notNull: { msg: "Nama harus diisi" },
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "URL harus diisi" },
          notNull: { msg: "URL harus diisi" },
          isUrl: { msg: "URL tidak valid" },
        },
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "User harus diisi" },
          notNull: { msg: "User harus diisi" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password harus diisi" },
          notNull: { msg: "Password harus diisi" },
        },
      },
    },
    {
      sequelize,
      modelName: "Camera",
      timestamps: false,
    }
  );

  return Camera;
};
