"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      // define association here
    }

    getLastLog() {
      return sequelize.models.AccessLog.findOne({
        where: { MemberId: this.id },
        order: [["createdAt", "DESC"]],
        limit: 1,
      });
    }

    get isExpired() {
      return this.expiryDate && this.expiryDate < new Date();
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
