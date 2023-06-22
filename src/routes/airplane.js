const {airplane} = require("../controllers");
const express = require("express");
const router = express.Router();
const role = require("../middlewares/role");
const jwt = require("../middlewares/jwtAuth");


router.get("/", airplane.getAll);
router.post("/", jwt.authenticate, role.hasRole(["ADMIN"]), airplane.create);

module.exports = router;