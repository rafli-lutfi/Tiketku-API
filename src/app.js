require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {PORT,SENTRY_DSN, NODE_ENV} = process.env;
const router = require("./routes");
const Sentry = require("@sentry/node");
const cors = require("cors");

const app = express();

Sentry.init({
	dsn: SENTRY_DSN,
	environment: NODE_ENV || "development",
	integrations: [
		new Sentry.Integrations.Http({tracing: true}),
		new Sentry.Integrations.Express({app}),
		...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
	],
	tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(router);

app.use(Sentry.Handlers.errorHandler());

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