// Modules
const path = require("node:path");
const express = require("express");
const httpCreateError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression"); // compress responses so that user downloads them faster
const helmet = require("helmet"); // protection against security vulnerabilities
const RateLimit = require("express-rate-limit"); // protection against repeated requests
const cors = require("cors");
// Routers
const apiRouter = require("./routes/api");

// Connect to MongoDB
async function mongoConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error(err);
  }
}
mongoConnect();

// App
const app = express();

// Security & compression
const securityAndCompression = [
  RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
  }), // need to design page for when limit is exceeded
  helmet.contentSecurityPolicy(),
  compression(),
];
app.use(securityAndCompression);

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Development logger
app.use(morgan("dev"));

// Retrieve objects made with POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Supply static files
app.use(express.static("./public"));

// Routes
app.use(cors());

app.get("/", (req, res) => {
  res.send("This be the result.");
});
app.use("/api/v1", apiRouter);

// Error-handling
app.use((req, res, next) => {
  next(httpCreateError(404));
});

// the 4TH PARAMTER "next" is required to let Express know this is an error-handling custom function
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send error message
  res
    .status(err.status || 500)
    .json({ status: err.status || 500, message: err.message });
});

// Export
module.exports = app;
