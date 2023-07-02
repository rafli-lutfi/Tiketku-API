const express = require("express");
const {payment} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();
const {confirmPayment} = require("../middlewares/validation/payment");
const validate = require("../middlewares/validate");

router.post("/", validate(confirmPayment), jwt.authenticate, payment.confirmPayment);

module.exports = router;