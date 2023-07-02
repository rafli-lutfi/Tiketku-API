const {airport} = require("../controllers");
const express = require("express");
const router = express.Router();
const {search} = require("../middlewares/validation/airport");
const validate = require("../middlewares/validate");

router.get("/", airport.getAll);
router.post("/search", validate(search), airport.search);
router.get("/favorite", airport.favoriteDestination);

module.exports = router;