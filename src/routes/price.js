const {price} = require("../controllers");
const express = require("express");
const router = express.Router();
const role = require("../middlewares/role");
const jwt = require("../middlewares/jwtAuth");

router.get("/", price.getAll);
router.post("/", jwt.authenticate, role.hasRole(["ADMIN"]), price.create);

module.exports = router;
