"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const passport = require("passport");

module.exports = app => {
  app.use(bodyParser.json());

  /** Method to generate access token */
  app.post(
    "/api/generate_access_token",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      const user = req.body;
      if (user.type === "api") {
        user.token_id = `${user.company_id}-${user.product_id}-${Date.now()}`;
      }
      if (user.type === "service") {
        user.token_id = `${user.company_id}-${user.company_code}-${Date.now()}`;
      }
      const token = helper.generateToken(user, 60 * 5 * 1);
      axios
        .post(URLS.TOKENS, user)
        .then(response => {
          res.send({message: response.data, token: "Bearer " + token});
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error while registering token"
          });
        });
    }
  );
};
