const router = require("express").Router();
const {country} = require("../controllers");


router.get("/", country.index);


module.exports = router;