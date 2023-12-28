"use strict";
const bodyParser = require("body-parser");
const passport = require("passport");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get(
    "/api/settlement-request/:loan_id/:company_id/:product_id/:user_id/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { company_id, product_id,loan_id , user_id , page , limit} =
      req.params;
      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(
          `${URLS.SETTLEMENT_REQUEST}/${loan_id}/${page}/${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
           res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while getting settlement request details."
          });
        });
    }
    );
};