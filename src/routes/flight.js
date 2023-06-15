const express = require("express");
const router = express.Router();
const { flight } = require("../controllers");


router.get("/", flight.getAll);
router.post("/", flight.create);
router.post("/search", flight.search);

module.exports = router;



