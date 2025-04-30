const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { User } = require("../models");
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
        const users = await User.findAll(options);
        return res.status(200).json(users);
      }

      const { count: total, rows } = await User.findAndCountAll(options);
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
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }

      await user.update(req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }

      await user.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
