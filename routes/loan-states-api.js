"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/loan-states/:company_id/:product_id/:user_id/:loan_id",
    (req, res) => {
      try {
        const token = helper.generateToken(
          {
            company_id: req.params.company_id,
            product_id: req.params.product_id,
            user_id: req.params.user_id,
            type: "dash-api"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.GET_LOAN_STATE_BY_LOAN_ID}/${req.params.loan_id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            throw {
              success: false,
              message: error.response.data
            };
          });
      } catch (error) {
        return res.status(400).send(error);
      }
    }
  );
};
