"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reader extends Model {
    static associate(models) {
      Reader.belongsTo(models.Gate, {
        foreignKey: "GateId",
        as: "gate",
      });
    }
  }

  Reader.init(
    {
      name: DataTypes.STRING,
      prefix: DataTypes.STRING,
      type: DataTypes.ENUM("IN", "OUT"),
      GateId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reader",
      timestamps: false,
    }
  );

  return Reader;
};
