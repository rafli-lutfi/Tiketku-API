const router = require("express").Router();
const {notif} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");

router.get("/", jwt.authenticate, notif.index);
router.get("/un_read", jwt.unread, notif.unRead);
router.put("/:id/read", jwt.authenticate, notif.readNotif);

module.exports = router;