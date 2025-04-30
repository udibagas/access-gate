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
      name: DataTypes.STRING,
      device: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Gate",
      timestamps: false,
    }
  );

  return Gate;
};
