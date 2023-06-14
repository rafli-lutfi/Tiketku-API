const router = require("express").Router();
const user = require("./user");
const airline = require("./airline");
const price = require("./price");
const airplane = require("./airplane");
const airport = require("./airport");
const flight = require("./flight");



router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use(user);
router.use("/airline", airline);
router.use("/price", price);
router.use("/airplane", airplane);
router.use("/airport", airport);
router.use("/flight", flight);



module.exports = router;
