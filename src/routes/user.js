const express = require("express");
const multer = require("multer");
const router = express.Router();
const { user, uploadFile, otp, } = require("../controllers");
const jwt = require("../middlewares/jwtAuth");
const validate = require("../middlewares/validate");
const {register, forgotPassword, login, updateProfile} = require("../middlewares/validation/user");
const {resendEmailVerification, resetPassword, verifyAccount} = require("../middlewares/validation/otp");

router.post("/auth/register", validate(register), user.register);
router.post("/auth/login", validate(login), user.login);
router.get("/auth/oauth", user.googleOauth2);

router.post("/register/verifyAccount", validate(verifyAccount), otp.verifyAccount);
router.post("/auth/resetPassword", validate(resetPassword), otp.resetPassword);

router.put("/user/updateProfile", multer().single("media"), validate(updateProfile), jwt.authenticate,  uploadFile.uploadAvatar, user.updateProfile);
router.post("/user/forgotpassword", validate(forgotPassword), user.forgotPassword);
router.post("/user/resendVerification", validate(resendEmailVerification), otp.resendEmailVerfication);
router.get("/user/getdetail", jwt.authenticate, user.getDetail);






module.exports = router;



