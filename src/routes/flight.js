const express = require("express");
const router = express.Router();
const { flight } = require("../controllers");
const flightValidation = require("../middlewares/validation/flight");

router.post("/search", flightValidation.search, flight.search);
router.post("/detail", flightValidation.detail, flight.detail);

module.exports = router;



