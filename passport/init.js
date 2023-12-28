var login = require("./login");
var signup = require("./signup");
var jwt = require("./jwt");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {});

  login(passport);
  signup(passport);
  jwt(passport);
};
