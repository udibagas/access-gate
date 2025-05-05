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

      AccessLog.hasMany(models.Snapshot, {
        foreignKey: "AccessLogId",
        as: "snapshots",
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

  AccessLog.afterCreate(async (log) => {
    const { Reader, Snapshot } = sequelize.models;
    const reader = await Reader.findByPk(log.ReaderId, {
      include: "cameras",
    });

    reader.cameras.forEach(async (camera) => {
      const filepath = await camera.takeSnapshot(true);
      await Snapshot.create({
        AccessLogId: log.id,
        CameraId: camera.id,
        filepath,
      });
    });

    console.log("Snapshot created successfully");
  });

  return AccessLog;
};
