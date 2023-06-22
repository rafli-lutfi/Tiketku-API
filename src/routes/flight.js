const express = require("express");
const router = express.Router();
const { flight } = require("../controllers");
const role = require("../middlewares/role");
const jwt = require("../middlewares/jwtAuth");



router.get("/", flight.getAll);
router.post("/", jwt.authenticate, role.hasRole(["ADMIN"]), flight.create);
router.post("/search", flight.search);

module.exports = router;



