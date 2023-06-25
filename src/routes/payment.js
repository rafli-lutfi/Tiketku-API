const express = require("express");
const {payment} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();
const paymentValidation = require("../middlewares/validation/payment");

router.post("/", paymentValidation.confirmPayment, jwt.authenticate, payment.confirmPayment);

module.exports = router;