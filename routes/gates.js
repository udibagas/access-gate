const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { Gate } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    const { page = 1, pageSize: limit = 10, search, paginated } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      order: [["name", "asc"]],
    };

    if (search) {
      options.where = {
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
      };
    }

    try {
      if (paginated === "false") {
        const gates = await Gate.findAll(options);
        return res.status(200).json(gates);
      }

      const { count: total, rows } = await Gate.findAndCountAll(options);
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
      const gate = await Gate.create(req.body);
      res.status(201).json(gate);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const gate = await Gate.findByPk(req.params.id);

      if (!gate) {
        const error = new Error("Gate not found");
        error.status = 404;
        throw error;
      }

      await gate.update(req.body);
      res.status(200).json(gate);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const gate = await Gate.findByPk(req.params.id);

      if (!gate) {
        const error = new Error("Gate not found");
        error.status = 404;
        throw error;
      }

      await gate.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
