const fs = require("fs");
const router = require("express").Router();
const { auth } = require("../middlewares/auth.middleware");
const { Snapshot } = require("../models");

router.use(auth).get("/", async (req, res) => {
  const { directory } = req.query;

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
      label: nodes.at(-1),
      path: node,
      isFile: isFile,
      isLeaf: isFile,
      url: `${baseUrl}/${node}`,
    };
  });

  res.status(200).json(data);
});

module.exports = router;
