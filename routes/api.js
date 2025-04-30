const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/gates", require("./gates"));

module.exports = router;
