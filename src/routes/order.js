const express = require("express");
const {order} = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const router = express.Router();

router.get("/", order.getAll);
router.post("/", jwt.authenticate, order.create);

module.exports = router;