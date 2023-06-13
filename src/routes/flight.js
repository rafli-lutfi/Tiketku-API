const express = require("express");
const router = express.Router();
const { flight } = require("../controllers");


router.get("/flight", flight.getAll);
router.post("/flight", flight.create);

module.exports = router;



