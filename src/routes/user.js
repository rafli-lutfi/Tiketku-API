const express = require("express");
const multer = require("multer");
const router = express.Router();
const { user, uploadFile, otp, } = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const userValidation = require("../middlewares/validation/user");
const otpValidation = require("../middlewares/validation/otp");

router.post("/auth/register", userValidation.register, user.register);
router.post("/auth/login", userValidation.login, user.login);
router.get("/auth/oauth", user.googleOauth2);

router.post("/register/verifyAccount", otpValidation.verifyAccount, otp.verifyAccount);
router.post("/auth/resetPassword", otpValidation.resetPassword, otp.resetPassword);

router.put("/user/updateProfile", multer().single("media"), userValidation.updateProfile, jwt.authenticate,  uploadFile.uploadAvatar, user.updateProfile);
router.post("/user/forgotpassword", userValidation.forgotPassword, user.forgotPassword);
router.post("/user/resendVerification", otpValidation.resendEmailVerification, otp.resendEmailVerfication);
router.get("/user/getdetail", jwt.authenticate, user.getDetail);






module.exports = router;



