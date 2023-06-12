const express = require("express");
const multer = require("multer");
const router = express.Router();
const { user, uploadFile, otp, } = require("../controllers");
const jwt = require("../middlewares/jwtAuth");

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);

router.put("/user/updateProfile", jwt.authenticate, multer().single("media"), uploadFile.uploadAvatar, user.updateProfile);
router.post("/user/forgotpassword", user.forgotPassword);

router.get("/register/verifyAccount", otp.verifyAccount);
router.post("/user/resetPassword", otp.resetPassword);





module.exports = router;



