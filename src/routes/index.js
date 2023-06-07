const router = require("express").Router();
const user = require("./user");

router.post("/test", (req, res) => {
	const {name} = req.body;
	res.status(200).json({
		status: true,
		message: `welcome ${name} to tiketku-API`,
		data: null
	});
});

router.use("/auth", user);


module.exports = router;
