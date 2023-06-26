const express = require("express");
const {order} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();
const orderValidation = require("../middlewares/validation/order");

router.get("/", jwt.authenticate, order.getAll);
router.get("/:order_id", orderValidation.getDetail, jwt.authenticate, order.getDetail);
router.post("/", orderValidation.create, jwt.authenticate, order.create);

module.exports = router;