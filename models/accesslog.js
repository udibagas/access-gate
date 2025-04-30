"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccessLog extends Model {
    static associate(models) {
      AccessLog.belongsTo(models.Member, {
        foreignKey: "MemberId",
        as: "member",
      });
      AccessLog.belongsTo(models.Gate, {
        foreignKey: "GateId",
        as: "gate",
      });
      AccessLog.belongsTo(models.Reader, {
        foreignKey: "ReaderId",
        as: "reader",
      });
    }
  }

  AccessLog.init(
    {
      MemberId: DataTypes.INTEGER,
      GateId: DataTypes.INTEGER,
      ReaderId: DataTypes.INTEGER,
      cardNumber: DataTypes.STRING,
      vehicleNumber: DataTypes.STRING,
      type: DataTypes.ENUM("IN", "OUT"),
    },
    {
      sequelize,
      modelName: "AccessLog",
    }
  );

  return AccessLog;
};
