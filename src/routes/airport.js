const {airport} = require("../controllers");
const express = require("express");
const router = express.Router();

router.get("/", airport.getAll);
router.post("/", airport.create);

module.exports = router;