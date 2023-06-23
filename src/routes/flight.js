const express = require("express");
const router = express.Router();
const { flight } = require("../controllers");

router.get("/", flight.getAll);
router.post("/search", flight.search);

module.exports = router;



