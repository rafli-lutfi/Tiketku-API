const express = require("express");
const {order} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();
const {create, getDetail} = require("../middlewares/validation/order");
const validate = require("../middlewares/validate");

router.get("/", jwt.authenticate, order.getAll);
router.get("/:order_id", validate(getDetail), jwt.authenticate, order.getDetail);
router.post("/", validate(create), jwt.authenticate, order.create);

module.exports = router;