"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CameraReader extends Model {
    static associate(models) {
      // define association here
    }
  }

  CameraReader.init(
    {
      ReaderId: DataTypes.INTEGER,
      CameraId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CameraReader",
    }
  );

  return CameraReader;
};
