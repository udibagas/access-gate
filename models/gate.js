"use strict";
const winston = require("winston");
const moment = require("moment");
const { Model } = require("sequelize");
const WebSocketTransport = require("../logger/WebsocketTransport");
const MySocket = require("../lib/mysocket");
const Audio = require("../lib/audio");
const RunningText = require("../lib/runningtext");

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

      setTimeout(() => {
        this.connect();
      }, 1000);
    }

    connect() {
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
        if (this.state === "idle") return;
        await this.proceed();
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

    async proceed(data = {}) {
      const transactionData = {
        gate_in_id: this.id,
        jenis_kendaraan: this.jenis_kendaraan,
        ...data,
      };

      logger.info(
        `${this.name}: Proceeding with data: ${JSON.stringify(transactionData)}`
      );

      try {
        const { data } = await axios.post(
          `${API_URL}/parkingTransaction/apiStore`,
          transactionData
        );
        logger.info(
          `${this.name}: ${data.message} - ${data.data.nomor_barcode} `
        );
        this.runningText.showThankYou();
        this.openGate();
      } catch (error) {
        logger.error(
          `${this.name}: ${error.response?.data?.message || error.message}`
        );

        this.runningText.setText("GAGAL|SILAKAN HUBUNGI PETUGAS");
      }
    }

    async checkMembership(nomor_kartu, card_type) {
      try {
        const response = await axios.get(`${API_URL}/member/search`, {
          params: { nomor_kartu, card_type, status: 1 },
        });
        return response.data;
      } catch (error) {
        logger.error(
          `${this.name}: ${error.response?.data?.message || err.message}`
        );
        return null;
      }
    }

    async handleMemberCard(data) {
      const cardData = data.slice(1);
      const cardNumber = parseInt(cardData, 16).toString();
      const member = await this.checkMembership(cardNumber, "RFID");

      if (!member) {
        this.runningText.setText("MAAF|KARTU TIDAK TERDAFTAR");
        this.audio.playCardUnregistered();
        return;
      }

      if (member.expired) {
        this.runningText.setText("MAAF|KARTU HABIS MASA BERLAKU");
        this.audio.playCardExpired();
        return;
      }

      if (member.unclosed) {
        this.runningText.setText("MAAF|KARTU BELUM SELESAI TRANSAKSI");
        this.audio.playUnclosedTransaction();
        return;
      }

      if (member.expired_in == 5) {
        this.runningText.setText("MASA BERLAKU KARTU HABIS DALAM|5 HARI");
        this.audio.playExpiredIn5Days();
      }

      if (member.expired_in == 1) {
        this.runningText.setText("MASA BERLAKU KARTU HABIS DALAM|1 HARI");
        this.audio.playExpiredIn1Day();
      }

      await this.proceed({
        is_member: 1,
        nomor_kartu: member.nomor_kartu,
        member_id: member.id,
      });
    }

    async saveLog(cardNumber, prefix) {
      // cari reader berdasarkan prefix
      const Reader = sequelize.models.Reader;
      const reader = await Reader.findOne({
        where: {
          prefix,
        },
      });

      if (!reader) {
        throw new Error(`Reader with prefix ${prefix} not found`);
      }

      // cari member berdasarkan cardNumber
      const Member = sequelize.models.Member;
      const member = await Member.findOne({
        where: {
          cardNumber,
        },
      });

      if (!member) {
        throw new Error(`Member with Card Number ${cardNumber} not found`);
      }

      if (member.status === false) {
        throw new Error(`Member with Card Number ${cardNumber} is not active`);
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
        AccessLog = sequelize.models.AccessLog;
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

  return Gate;
};
