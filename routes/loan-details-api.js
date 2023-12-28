"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/loandetails/:loan_id/:company_id/:product_id/:user_id/:loan_schema_id",
    (req, res) => {
      const {
        company_id,
        product_id,
        loan_id,
        user_id,
        loan_schema_id,
      } = req.params;
      const token = helper.generateToken(
        {
          company_id,
          product_id,
          loan_schema_id,
          user_id,
          type: "dash",
        },
        60 * 5 * 1
      );
      /** Method to get  */
      axios
        .get(`${URLS.GET_BORROWER_DETAILS}/${loan_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error while getting loan details",
          });
        });
    }
  );
};
