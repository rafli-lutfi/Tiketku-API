const router = require("express").Router();
const user = require("./user");
const airline = require("./airline");
const airport = require("./airport");
const flight = require("./flight");
const order = require("./order");
const notif = require("./notification");
const payment = require("./payment");



router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use(user);
router.use("/airline", airline);
router.use("/airport", airport);
router.use("/flight", flight);
router.use("/order", order);

router.use("/notif", notif);
router.use("/payment", payment);


module.exports = router;
