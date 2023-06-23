const {airport} = require("../controllers");
const express = require("express");
const router = express.Router();



router.get("/", airport.getAll);
router.post("/search", airport.search);
router.get("/favorite", airport.favoriteDestination);

module.exports = router;