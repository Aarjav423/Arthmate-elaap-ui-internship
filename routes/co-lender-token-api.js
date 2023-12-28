"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const passport = require("passport");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/co_lender_token",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      const user = req.body;
      user.token_id = `${user.co_lender_id}-${user.co_lender_shortcode}-${Date.now()}`;
      const token = helper.generateCoLenderToken(user, 60 * 5 * 1);
      const uiToken = helper.generateToken(
          {
              user_id: user.user_id,
              type: "dash"
          },
          60 * 5
      )
      axios
        .post(URLS.CO_LENDER_TOKENS, user,{
            headers :{
                Authorization: `Bearer ${uiToken}`
            }
        })
        .then(response => {
          res.send({message: response.data, token: "Bearer " + token});
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data?.message || "Error while registering token"
          });
        });
    }
  );
};
