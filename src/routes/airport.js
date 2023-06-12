const airport = require("../controllers/airport");
const express = require("express");
const router = express.Router();

router.get("/airport", airport.getAll);
router.post("/airport", airport.create);

module.export = router;