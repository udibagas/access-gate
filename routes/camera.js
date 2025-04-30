const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { Camera } = require("../models");
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
        const cameras = await Camera.findAll(options);
        return res.status(200).json(cameras);
      }

      const { count: total, rows } = await Camera.findAndCountAll(options);
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
      const camera = await Camera.create(req.body);
      res.status(201).json(camera);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const camera = await Camera.findByPk(req.params.id);

      if (!camera) {
        const error = new Error("Camera not found");
        error.status = 404;
        throw error;
      }

      await camera.update(req.body);
      res.status(200).json(camera);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const camera = await Camera.findByPk(req.params.id);

      if (!camera) {
        const error = new Error("Camera not found");
        error.status = 404;
        throw error;
      }

      await camera.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
