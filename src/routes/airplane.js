const {airplane} = require("../controllers");
const express = require("express");
const router = express.Router();

router.get("/", airplane.getAll);
router.post("/", airplane.create);

module.exports = router;