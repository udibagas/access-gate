const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { AccessLog } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    const { page = 1, pageSize: limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      order: [["updatedAt", "desc"]],
      limit: +limit,
      offset,
    };

    if (search) {
      options.where = {
        [Op.or]: [
          { cardNumber: { [Op.iLike]: `%${search}%` } },
          { vehicleNumber: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    try {
      const { count: total, rows } = await AccessLog.findAndCountAll(options);
      res.status(200).json({
        total,
        page: +page,
        rows,
        from: offset + 1,
        to: offset + rows.length,
      });
    } catch (error) {
      next(error);
    }
  })

  .post("/", async (req, res, next) => {
    try {
      const accessLog = await AccessLog.create(req.body);
      res.status(201).json(accessLog);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const accessLog = await AccessLog.findByPk(req.params.id);

      if (!accessLog) {
        const error = new Error("AccessLog not found");
        error.status = 404;
        throw error;
      }

      await accessLog.update(req.body);
      res.status(200).json(accessLog);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const accessLog = await AccessLog.findByPk(req.params.id);

      if (!accessLog) {
        const error = new Error("AccessLog not found");
        error.status = 404;
        throw error;
      }

      await accessLog.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
