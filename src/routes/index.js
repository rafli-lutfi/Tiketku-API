const router = require("express").Router();
const user = require("./user");
const airline = require("./airline");

router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use(user);
router.use("/airlines", airline);

module.exports = router;
