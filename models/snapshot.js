"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Snapshot extends Model {
    static associate(models) {
      Snapshot.belongsTo(models.Camera, {
        foreignKey: "CameraId",
        as: "camera",
      });

      Snapshot.belongsTo(models.AccessLog, {
        foreignKey: "AccessLogId",
        as: "accessLog",
      });
    }
  }

  Snapshot.init(
    {
      CameraId: DataTypes.INTEGER,
      AccessLogId: DataTypes.INTEGER,
      filepath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Snapshot",
      updatedAt: false,
    }
  );

  return Snapshot;
};
