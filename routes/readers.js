const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { Reader } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    try {
      const readers = await Reader.findAll({ order: [["name", "asc"]] });
      return res.status(200).json(readers);
    } catch (error) {
      next(error);
    }
  })

  .post("/", async (req, res, next) => {
    try {
      const reader = await Reader.create(req.body);
      res.status(201).json(reader);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const reader = await Reader.findByPk(req.params.id);

      if (!reader) {
        const error = new Error("Reader not found");
        error.status = 404;
        throw error;
      }

      await reader.update(req.body);
      res.status(200).json(reader);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const reader = await Reader.findByPk(req.params.id);

      if (!reader) {
        const error = new Error("Reader not found");
        error.status = 404;
        throw error;
      }

      await reader.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
