"use strict";
// loads enviroment variables
require("dotenv").config();

// Third Party requirements
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const bodyParser = require("body-parser");
var passport = require("passport");
var path = require("path");

// local requirements
const config = require("./config/index");

app.set("superSecret", config.secret); // secret variable
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

// Initialize Passport
app.use(passport.initialize());

const optionalJwt = function (req, res, next) {
  if (req.headers["authorization"]) {
    return passport.authenticate("jwt", { session: false })(req, res, next);
  }
  return next();
};

app.use([optionalJwt], (req, res, next) => {
  console.log("req.token_expired", req.token_expired);
  console.log("req.expiry_reason", req.expiry_reason);
  console.log("req.url", req.url);
  if (req.token_expired && req.url !== "/api/login") {
    console.log("req.url inside", req.url);
    return res.status(400).json({
      message: `Forbidden. ${req.expiry_reason}`
    });
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

var initPassport = require("./passport/init");
initPassport(passport);

// configure midddlewares
app.use("/public", express.static(__dirname + "/public"));
app.use("/media", express.static(__dirname + "/media"));

app.use(express.static(path.join(__dirname, process.env.FRONT_END)));

require("./routes/index")(app, passport);

var listener = app.listen(process.env.PORT, function () {
  console.log(`Running now! on port ${process.env.PORT}`);
});
