const router = require("express").Router();

router.use("/cameras", require("./cameras"));
router.use("/gates", require("./gates"));
router.use("/users", require("./users"));

module.exports = router;
