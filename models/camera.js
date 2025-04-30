"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Camera extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Camera.init(
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      user: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Camera",
      timestamps: false,
    }
  );

  return Camera;
};
