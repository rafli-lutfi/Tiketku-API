const {airport} = require("../controllers");
const express = require("express");
const router = express.Router();
const airportValidation = require("../middlewares/validation/airport");



router.get("/", airport.getAll);
router.post("/search", airportValidation.search, airport.search);
router.get("/favorite", airport.favoriteDestination);

module.exports = router;