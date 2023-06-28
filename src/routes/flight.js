const express = require("express");
const router = express.Router();
const { flight } = require("../controllers");
const {detail, search} = require("../middlewares/validation/flight");
const validate = require("../middlewares/validate");

router.post("/search", validate(search), flight.search);
router.post("/detail", validate(detail), flight.detail);

module.exports = router;



