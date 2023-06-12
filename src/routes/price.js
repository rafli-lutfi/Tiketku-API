const price = require("../controllers/price");
const express = require("express");
const router = express.Router();

router.get("/price", price.getAll);
router.post("/price", price.create);

module.exports = router;
