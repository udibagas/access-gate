"use strict";
const { default: axios } = require("axios");
const { Model } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const AxiosDigestAuth = require("@mhoc/axios-digest-auth");

module.exports = (sequelize, DataTypes) => {
  class Camera extends Model {
    static associate(models) {
      // define association here
    }

    async takeSnapshot(saveToFile = false) {
      const digestAuth = new AxiosDigestAuth({
        username: this.user,
        password: this.password,
      });

      const response = await digestAuth.request({
        method: "GET",
        url: this.url,
        responseType: "arraybuffer",
        headers: {
          Accept: "image/jpeg",
        },
      });

      console.log("Snapshot taken successfully");

      if (saveToFile) {
        const dir = fs.mkdirSync(`snapshots/` + moment().format("YYYY/MM/DD"), {
          recursive: true,
        });
        const filePath = `${dir}/${this.name}-${Date.now()}.jpeg`;

        fs.writeFile(filePath, response.data, (err) => {
          if (err) {
            return console.error("Error saving snapshot:", err);
          }

          console.log("Snapshot saved to", filePath);
        });
      }

      // Convert arraybuffer to Base64
      const base64Image = Buffer.from(response.data).toString("base64");

      // Return Base64-encoded string
      return `data:image/jpeg;base64,${base64Image}`;
    }
  }

  Camera.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama harus diisi" },
          notNull: { msg: "Nama harus diisi" },
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "URL harus diisi" },
          notNull: { msg: "URL harus diisi" },
          isUrl: { msg: "URL tidak valid" },
        },
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "User harus diisi" },
          notNull: { msg: "User harus diisi" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password harus diisi" },
          notNull: { msg: "Password harus diisi" },
        },
      },
    },
    {
      sequelize,
      modelName: "Camera",
      timestamps: false,
    }
  );

  return Camera;
};
