const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { Member } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    const { page = 1, pageSize: limit = 10, search, paginated } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      order: [["name", "asc"]],
      limit: +limit,
      offset,
    };

    if (search) {
      options.where = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { cardNumber: { [Op.iLike]: `%${search}%` } },
          { vehicleNumber: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    try {
      if (paginated === "false") {
        const members = await Member.findAll(options);
        return res.status(200).json(members);
      }

      const { count: total, rows } = await Member.findAndCountAll(options);
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
      const member = await Member.create(req.body);
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const member = await Member.findByPk(req.params.id);

      if (!member) {
        const error = new Error("Member not found");
        error.status = 404;
        throw error;
      }

      await member.update(req.body);
      res.status(200).json(member);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const member = await Member.findByPk(req.params.id);

      if (!member) {
        const error = new Error("Member not found");
        error.status = 404;
        throw error;
      }

      await member.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
