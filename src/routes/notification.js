const router = require("express").Router();
const {notif} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const notifValidation = require("../middlewares/validation/notification");

router.get("/", jwt.authenticate, notif.index);
router.get("/unread", jwt.authenticate, notif.unRead);
router.put("/:id/read", notifValidation.readNotif, jwt.authenticate, notif.readNotif);

module.exports = router;