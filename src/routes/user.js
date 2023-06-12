const express = require("express");
const multer = require("multer");
const router = express.Router();
const { user, uploadFile, otp, } = require("../controllers");
const airport = require("../controllers/airport");
const airline = require("../controllers/airline");
const airplane = require("../controllers/airplane");
const jwt = require("../middlewares/jwtAuth");

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);

router.put("/user/updateProfile", jwt.authenticate, multer().single("media"), uploadFile.uploadAvatar, user.updateProfile);
router.post("/user/forgotpassword", user.forgotPassword);

router.get("/register/verifyAccount", otp.verifyAccount);
router.post("/user/resetPassword", otp.resetPassword);

router.get("/airport", airport.getAll);
router.post("/airport", airport.create);

router.get("/airline", airline.getAll);
router.post("/airline", airline.create);

router.get("/airplane", airplane.getAll);
router.post("/airplane", airplane.create);

module.exports = router;



