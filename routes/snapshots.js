const fs = require("fs");
const router = require("express").Router();
const { auth } = require("../middlewares/auth.middleware");
const { Snapshot } = require("../models");
const path = require("path");

router
  .use(auth)
  .get("/", async (req, res) => {
    const { directory = "snapshots" } = req.query;

    const dirs = fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(directory, dirent.name));

    const files = fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => path.join(directory, dirent.name));

    const data = [...dirs, ...files].map((node) => {
      const nodes = node.split(path.sep);
      const isFile = path.extname(node) !== "";
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      return {
        title: nodes.at(-1),
        key: node,
        isLeaf: isFile,
        url: `${baseUrl}/${node}`,
      };
    });

    res.status(200).json(data);
  })

  .post("/delete", async (req, res) => {
    const { path } = req.body;

    try {
      fs.unlinkSync(path);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Error deleting file" });
    }
  });

module.exports = router;
