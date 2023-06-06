const router = require("express").Router();

router.post("/test", (req, res) => {
	const {name} = req.body;
	res.status(200).json({
		status: true,
		message: `welcome ${name} to tiketku-API`,
		data: null
	});
});

module.exports = router;