const airplane = require("../controllers/airplane");
const express = require("express");
const router = express.Router();

router.get("/airplane", airplane.getAll);
router.post("/airplane", airplane.create);

module.exports = router;