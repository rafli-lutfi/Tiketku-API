const router = require("express").Router();
const user = require("./user");
const airline = require("./airline");
const price = require("./price");
const airplane = require("./airplane");
const airport = require("./airport");



router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use(user);
router.use("/airlines", airline);
router.use("/price", price);
router.use("/airplane", airplane);
router.use("/airport", airport);




module.exports = router;
