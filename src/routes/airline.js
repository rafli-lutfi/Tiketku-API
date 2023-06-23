const router = require("express").Router();
const {airline} = require("../controllers");


router.get("/", airline.getAll);
router.get("/:id", airline.getDetail);


module.exports = router;