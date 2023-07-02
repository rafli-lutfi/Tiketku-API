const router = require("express").Router();
const {notif} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const {readNotif} = require("../middlewares/validation/notification");
const validate = require("../middlewares/validate");

router.get("/", jwt.authenticate, notif.index);
router.get("/unread", jwt.authenticate, notif.unRead);
router.get("/:id/read", validate(readNotif), jwt.authenticate, notif.readNotif);

module.exports = router;