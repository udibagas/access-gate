const router = require("express").Router();

router.use("/accessLogs", require("./accessLogs"));
router.use("/cameras", require("./cameras"));
router.use("/gates", require("./gates"));
router.use("/members", require("./members"));
router.use("/readers", require("./readers"));
router.use("/users", require("./users"));
router.use("/snapshots", require("./users"));

module.exports = router;
