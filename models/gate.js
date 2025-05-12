"use strict";
const winston = require("winston");
const moment = require("moment");
const { Model } = require("sequelize");
const WebSocketTransport = require("../logger/WebsocketTransport");
const MySocket = require("../lib/mysocket");
const Audio = require("../lib/audio");
const RunningText = require("../lib/runningtext");
const connections = require("../connections");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const formattedTimestamp = moment(timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return `${formattedTimestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [new winston.transports.Console(), new WebSocketTransport()],
});

module.exports = (sequelize, DataTypes) => {
  class Gate extends Model {
    state = "idle";
    socket = new MySocket();
    audio = new Audio(this.socket);
    runningText = new RunningText(this.socket);

    reconnect() {
      this.socket.removeAllListeners();
      this.socket.destroy();
      this.reload();

      setTimeout(() => {
        this.connect();
      }, 3000);
    }

    connect() {
      this.socket.setKeepAlive(true, 5000);
      this.socket.setTimeout(10000);
      connections.push(this);
      logger.info(`${this.name}: Connecting to ${this.device}`);
      this.socket.connect(5000, this.device, () => {
        logger.info(`${this.name}: Connected to ${this.device}:${5000}`);
      });

      this.registerEventListeners();
    }

    registerEventListeners() {
      this.socket.on("connect", () => {
        logger.info(`${this.name}: Connected`);
      });

      this.socket.on("data", (data) => {
        this.parseData(data);
      });

      this.socket.on("close", () => {
        logger.error(
          `${this.name}: Connection closed. Reconnecting to ${this.name}...`
        );
        this.reconnect();
      });

      this.socket.on("error", (err) => {
        logger.error(
          `${this.name}: Connection error. Reconnecting to ${this.name}...`
        );
        this.reconnect();
      });
    }

    async parseData(data) {
      logger.debug(`${this.name}: ${data.toString("utf-8")}`);
      // remove header & footer
      const stringData = data.toString().slice(1, -1);

      // VEHICLE DETECTED
      if (stringData.slice(0, 5) === "IN1ON") {
        logger.info(`${this.name}: Vehicle detected`);
        this.state = "vehicle_detected";
        this.audio.playWelcome();
        this.runningText.showWelcome();
      }

      // VEHICLE TURNED BACK
      if (stringData.slice(0, 6) === "IN1OFF") {
        logger.info(`${this.name}: Vehicle turned back or in`);
        this.state = "idle";
      }

      // MEMBER CARD TAPPED
      if (stringData[0] === "W") {
        logger.info(`${this.name}: Member Card detected`);
        if (this.state === "idle") return;
        await this.handleMemberCard(stringData);
      }

      // TICKET BUTTON PRESSED
      if (stringData.slice(0, 5) === "IN2ON") {
        logger.info(`${this.name}: Button ticket pressed`);
      }

      // RESET BUTTON PRESSED
      if (stringData.slice(0, 3) === "IN3") {
        logger.info(`${this.name}: Button reset pressed`);
        this.state = "idle";
      }

      // HELP BUTTON PRESSED
      if (stringData.slice(0, 5) === "IN4ON") {
        logger.info(`${this.name}: Button help pressed`);
        if (this.state === "idle") return;
        this.runningText.showPleaseWait();
      }
    }

    openGate() {
      this.socket.sendCommand("TRIG1");
      logger.info(`${this.name}: Gate opened`);

      setTimeout(() => {
        this.state = "idle";
      }, 3000);
    }

    async handleMemberCard(data) {
      const cardData = data.slice(1);
      const cardNumber = parseInt(cardData, 16).toString();
      const { Member } = sequelize.models;
      const member = await Member.findOne({ where: { cardNumber } });

      if (!member) {
        logger.info(`${this.name}: Card number ${cardNumber} not registered`);
        this.runningText.setText("MAAF|KARTU TIDAK TERDAFTAR");
        this.audio.playCardUnregistered();
        return;
      }

      if (member.status === false) {
        logger.info(`${this.name}: Card number ${cardNumber} is not active`);
        this.runningText.setText("MAAF|KARTU TIDAK AKTIF");
        this.audio.playCardInactive();
        return;
      }

      if (member.isExpired) {
        logger.info(`${this.name}: Card number ${cardNumber} expired`);
        this.runningText.setText("MAAF|KARTU EXPIRED");
        this.audio.playCardExpired();
        return;
      }

      this.saveLog(member, data[0])
        .then((log) => {
          logger.info(JSON.stringify(log));
          this.audio.playThankYou();
          this.runningText.setText("TERIMA KASIH|SILAHKAN MASUK");
          this.openGate();
        })
        .catch((err) => {
          logger.error(`${this.name}: ${err.message}`);
          this.runningText.setText("MAAF|GAGAL MENYIMPAN LOG");
        });
    }

    async saveLog(member, prefix) {
      const { Reader, AccessLog } = sequelize.models;
      // cari reader berdasarkan prefix
      const reader = await Reader.findOne({
        where: { prefix },
        include: "cameras",
      });

      if (!reader) {
        throw new Error(`Reader with prefix ${prefix} not found`);
      }

      if (member.group == "member") {
        const lastLog = await member.getLastLog();

        if (reader.type == "IN") {
          if (lastLog && lastLog.type == "IN") {
            throw new Error(`Member with Card Number ${cardNumber} already IN`);
          }
        }

        if (reader.type == "OUT") {
          if (!lastLog || lastLog.type == "OUT") {
            throw new Error(`Member with Card Number ${cardNumber} not IN yet`);
          }
        }

        // save log
        const log = await AccessLog.create({
          MemberId: member.id,
          ReaderId: reader.id,
          GateId: this.id,
          cardNumber,
          vehicleNumber: member.vehicleNumber,
          type: reader.type,
        });

        return log;
      }
    }
  }

  Gate.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama gate harus diisi" },
          notNull: { msg: "Nama gate harus diisi" },
        },
      },
      device: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Device sudah terdaftar" },
        validate: {
          notEmpty: { msg: "Device harus diisi" },
          notNull: { msg: "Device harus diisi" },
        },
      },
    },
    {
      sequelize,
      modelName: "Gate",
      timestamps: false,
    }
  );

  Gate.afterCreate(async (gate) => {
    try {
      gate.connect();
    } catch (error) {
      console.error(`${gate.name} - ERROR - ${error.message}`);
    }
  });

  Gate.afterDestroy((gate) => {
    const index = connections.findIndex((g) => g.id === gate.id);
    if (index !== -1) {
      connections[index].socket.removeAllListeners();
      connections[index].socket.destroy();
      connections.splice(index, 1);
    }
  });

  Gate.afterUpdate(async (gate) => {
    const index = connections.findIndex((g) => g.id === gate.id);
    if (index !== -1) {
      connections[index].socket.removeAllListeners();
      connections[index].socket.destroy();
      connections.splice(index, 1);
    }

    gate.connect();
  });

  return Gate;
};
