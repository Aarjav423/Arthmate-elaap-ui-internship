const JWTstrategy = require("passport-jwt").Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const moment = require("moment");

module.exports = (passport) => {
  try {
    passport.use(
      new JWTstrategy(
        {
          //secret we used to sign our JWT
          secretOrKey: process.env.SECRET_KEY,
          //we expect the user to send the token as a query paramater with the name 'secret_token'
          jwtFromRequest:
            ExtractJWT.fromAuthHeaderAsBearerToken("Authorization"),
          passReqToCallback: true
        },
        (req, jwt_payload, done) => {
          const user = jwt_payload;
          const last_login_at = moment(user.last_login_at).format("YYYY-MM-DD");
          const today = moment().format("YYYY-MM-DD");
          console.log("today", today);
          const token_expired = moment(today) > moment(last_login_at);
          const password_updated_at = moment
            .utc(new Date(user.password_updated_at))
            .format("YYYY-MM-DD");
          const password_updated_since = moment().diff(
            password_updated_at,
            "days"
          );
          console.log("password_updated_since", password_updated_since);
          console.log("password_updated_at", password_updated_at);
          const passwordResetOld =
            password_updated_since > process.env.PASSWORD_RESET_EXPIRY_DAYS;
          // console.log("user", user);
          // console.log("password_updated_at", password_updated_at);
          // console.log("last_login_at", last_login_at);

          req["token_expired"] = !user || token_expired || passwordResetOld;
          const logoutReason = !user
            ? "User not found in token"
            : token_expired
            ? "Token day login expired"
            : passwordResetOld
            ? "Last password reset is older, kindly reset password."
            : "";
          req["expiry_reason"] = logoutReason;
          return done(null, user);
        }
      )
    );
  } catch (error) {
    console.log("error value======>", error);
  }
};
