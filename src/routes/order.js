const express = require("express");
const {order} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();

router.get("/", jwt.authenticate, order.getAll);
router.get("/:order_id", jwt.authenticate, order.getDetail);
router.post("/", jwt.authenticate, order.create);

module.exports = router;