const express = require("express");
const router = express.Router();
const { user } = require("../controllers");

router.post("/register", user.register);



module.exports = router;



