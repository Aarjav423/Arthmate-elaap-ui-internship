const axios = require("axios");
var LocalStrategy = require("passport-local").Strategy;
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");
const moment = require("moment");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      axios
        .post(URLS.LOGIN_USER, { email: username, userpass: password })
        .then((response) => {
          if (response) {
            const user = response.data.user;
            helper.comparePassword(password, user.userpass, (err, isMatch) => {
              if (err) {
                return done(err);
              }
              if (isMatch) {
                const token = helper.generateToken(user, "24h");
                return done(null, user, { token: "Bearer " + token });
              } else {
                return done({
                  message: "Invalid username or password!",
                });
              }
            });
          }
        })
        .catch((error) => {
          return done({
            message: error.response.data.message || "Something went wrong",
          });
        });
    })
  );
};
