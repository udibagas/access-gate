const { auth } = require("../middlewares/auth.middleware");
const { Camera } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    try {
      const cameras = await Camera.findAll({ order: [["name", "asc"]] });
      return res.status(200).json(cameras);
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
  })

  .post("/:id/snapshot", async (req, res, next) => {
    const { saveToFile } = req.body;

    try {
      const camera = await Camera.findByPk(req.params.id);

      if (!camera) {
        const error = new Error("Camera not found");
        error.status = 404;
        throw error;
      }

      const snapshot = await camera.takeSnapshot(saveToFile);
      res.status(200).json(snapshot);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
