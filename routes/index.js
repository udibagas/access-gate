var express = require("express");
const { auth } = require("../middlewares/auth.middleware");
var router = express.Router();

router.use("/auth", require("./auth"));
router.use("/api", auth, require("./api"));

module.exports = router;
