const {price} = require("../controllers");
const express = require("express");
const router = express.Router();

router.get("/", price.getAll);
router.post("/", price.create);

module.exports = router;
