const express = require("express");
const {payment} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();

router.post("/:order_id", jwt.authenticate, payment.confirmPayment);

module.exports = router;