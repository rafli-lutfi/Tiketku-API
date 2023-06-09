const express = require("express");
const multer = require("multer");
const router = express.Router();
const { user } = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const uploadFile = require("../controllers/uploadFile");

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);

router.put("/user/updateProfile", jwt.authenticate, multer().single("media"), uploadFile.uploadAvatar, user.updateProfile);

module.exports = router;



