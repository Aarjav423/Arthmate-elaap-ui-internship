"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");
module.exports = (app) => {
  app.use(bodyParser.json());

  app.post("/api/fetch_loan_template_data", (req, res) => {
    axios
      .post(URLS.FETCH_LOAN_SCHEMA_DATA_URL, req.body)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while fetching loan template data",
        });
      });
  });

  app.post("/api/get_loan_template_product_wise", (req, res) => {
    axios
      .post(URLS.GET_ALL_TEMPLATES, req.body)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .json({
            message:
              error.response.data.message ||
              "Error while fetching loan template",
          });
      });
  });
};
