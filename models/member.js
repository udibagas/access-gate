"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      // define association here
    }
  }

  Member.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      cardNumber: DataTypes.STRING,
      vehicleNumber: DataTypes.STRING,
      gender: DataTypes.ENUM("M", "F"),
      status: DataTypes.BOOLEAN,
      expiryDate: DataTypes.DATE,
      group: DataTypes.STRING,
      idNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Member",
    }
  );

  return Member;
};
