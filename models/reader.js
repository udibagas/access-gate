"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reader extends Model {
    static associate(models) {
      Reader.belongsTo(models.Gate, {
        foreignKey: "GateId",
        as: "gate",
      });

      Reader.belongsToMany(models.Camera, {
        through: "CameraReaders",
        as: "cameras",
        foreignKey: "ReaderId",
        otherKey: "CameraId",
      });
    }
  }

  Reader.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama reader harus diisi" },
          notNull: { msg: "Nama reader harus diisi" },
        },
      },
      prefix: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Prefix harus diisi" },
          notNull: { msg: "Prefix harus diisi" },
        },
      },
      type: {
        type: DataTypes.ENUM("IN", "OUT"),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Jenis reader harus diisi" },
          notNull: { msg: "Jenis reader harus diisi" },
        },
      },
      GateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Gate harus diisi" },
          notNull: { msg: "Gate harus diisi" },
        },
      },
    },
    {
      sequelize,
      modelName: "Reader",
      timestamps: false,
    }
  );

  return Reader;
};
