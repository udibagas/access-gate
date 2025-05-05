"use strict";
const { Model } = require("sequelize");
const SerialPort = require("serialport");
const DelimiterParser = require("@serialport/parser-delimiter");

module.exports = (sequelize, DataTypes) => {
  class Gate extends Model {
    port;

    async reconnect() {
      try {
        await this.reload();

        if (this.port instanceof SerialPort) {
          this.port = null;
        }

        setTimeout(() => {
          try {
            this.scan();
          } catch (error) {
            console.error(`${this.name} - ERROR - ${error.message}`);
          }
        }, 1000);
      } catch (error) {
        console.error(`${this.name} - ERROR - ${error.message}`);
      }
    }

    scan() {
      const { name, device: path, id: access_gate_id } = this;
      this.port = new SerialPort({
        path,
        baudRate: 9600,
      });

      console.log(`Connecting to gate ${name}...`);

      this.port.on("open", () => {
        console.log(`Serial ${path} (${name}) opened`);
      });

      const parser = this.port.pipe(new DelimiterParser({ delimiter: "#" }));
      parser.on("data", async (bufferData) => {
        const data = bufferData.toString();
        console.log(`${name} : ${data}`);
        const prefix = data[1];

        // skip kalau bukan detect card
        if (!"WX".includes(prefix)) {
          return;
        }

        let cardNumber = data.slice(2, 10);
        cardNumber = parseInt(cardNumber, 16); // convert to decimal
        console.log(`${name}: ${cardNumber}`);

        try {
          const log = await this.saveLog(cardNumber, prefix);
          console.log(`${name}: ${JSON.stringify(log)}`);
          // open gate
          this.port.write(Buffer.from(`*TRIG1#`));
        } catch (error) {
          console.error(error.message);
        }
      });

      this.port.on("error", (error) => {
        console.error(`${name} - ERROR - ${error.message}`);
        this.reconnect();
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
      gate.scan();
    } catch (error) {
      console.error(`${gate.name} - ERROR - ${error.message}`);
    }
  });

  return Gate;
};
