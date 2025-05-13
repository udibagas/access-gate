"use strict";
const { Model } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const DigestClient = require("digest-fetch");

module.exports = (sequelize, DataTypes) => {
  class Camera extends Model {
    async takeSnapshot(saveToFile = false) {
      const client = new DigestClient(this.user, this.password);
      const response = await client.fetch(this.url, {
        method: "GET",
        headers: {
          "Content-Type": "image/jpeg",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to take snapshot: ${response.status} ${response.statusText}`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("image/jpeg")) {
        throw new Error(
          `Invalid content type: ${contentType}. Expected image/jpeg`
        );
      }

      const buffer = await response.arrayBuffer();
      const dir = `snapshots/` + moment().format("YYYY/MM/DD");
      const filepath = `${dir}/${this.name}-${Date.now()}.jpeg`;

      if (saveToFile) {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFile(filepath, Buffer.from(buffer), (err) => {
          if (err) {
            return console.error("Error saving snapshot:", err);
          }

          console.log("Snapshot saved to", filepath);
        });
      }

      // Convert arraybuffer to Base64
      const base64Image = Buffer.from(buffer).toString("base64");
      return { imgSrc: `data:image/jpeg;base64,${base64Image}`, filepath };
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
