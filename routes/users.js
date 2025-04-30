const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { User } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    try {
      const users = await User.findAll({ order: [["name", "asc"]] });
      return res.status(200).json(users);
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
