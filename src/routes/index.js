const router = require("express").Router();
const user = require("./user");

router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use(user);


module.exports = router;
