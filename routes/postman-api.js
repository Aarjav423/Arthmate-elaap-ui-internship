"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const passport = require("passport");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post(
    "/api/postman/loanbook",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const reqData = req.body;
      const token = helper.generateToken(
        {
          company_id: reqData.company_id,
          loan_schema_id: reqData.loan_schema_id * 1,
          product_id: reqData.product_id,
          user_id: req.user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(
          URLS.POSTMAN_COLLECTION_LOANBOOK,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while getting postman collecton",
          });
        });
    }
  );
};
