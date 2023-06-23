const {airport} = require("../controllers");
const express = require("express");
const router = express.Router();
const role = require("../middlewares/role");
const jwt = require("../middlewares/jwtAuth");


router.get("/", airport.getAll);
router.post("/", jwt.authenticate, role.hasRole(["ADMIN"]), airport.create);
router.get("/bycity", airport.getByCity);
router.get("/favorite", airport.favoriteDestination);

module.exports = router;