"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }

    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    generateAuthToken() {
      const { id, name, role } = this;
      return jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    }
  }

  User.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: "Nama harus diisi" },
          notEmpty: { msg: "Nama harus diisi" },
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        set(value) {
          if (!value) return;
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash);
        },
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
      role: DataTypes.ENUM("admin", "user"),
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  return User;
};
