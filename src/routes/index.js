const router = require("express").Router();

router.get("/", (req, res) => {
	const err = err();
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

module.exports = router;