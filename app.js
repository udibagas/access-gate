require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// SPA
app.use(express.static("client-app/dist"));

const origin = process.env.CLIENT_URL?.split(",") ?? [];
app.use(cors({ origin, credentials: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/snapshots", express.static(path.join(__dirname, "snapshots")));

app.use(require("./routes/index"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(require("./middlewares/errorHandler.middleware"));

module.exports = app;
