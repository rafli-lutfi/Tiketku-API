require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {PORT} = process.env;

const router = require("./routes");

const app = express();
app.use(morgan("dev"));

app.use(router);

// handle error 404
app.use((req,res) =>{
	return res.status(404).json({
		status: false,
		message: "page not found 404",
		data: null
	});
});

// handle error 500
// eslint-disable-next-line no-unused-vars
app.use((err,req,res,next)=>{
	return res.status(500).json({
		status: false,
		message: err.message,
		data: null
	});
});

app.listen(PORT, () => console.log(`Api Running at http://localhost:${PORT}`));