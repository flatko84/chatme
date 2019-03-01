var createError = require("http-errors");
var express = require("express");
var flash = require('express-flash');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var Store = require("express-session").Store;
var bodyParser = require("body-parser");
var passport = require("passport");



var mustacheExpress = require('mustache-express');

// Start Express
var app = express();


// view engine setup
app.engine('mustache', mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());


//passport settings

app.use(express.static("public"));
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());



//Router

var indexRouter = require("./routes/index");
var accountRouter = require("./routes/account");
var roomRouter = require("./routes/rooms");
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/rooms", roomRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
