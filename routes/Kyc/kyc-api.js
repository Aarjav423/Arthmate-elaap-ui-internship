"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());
  

  app.post(
    "/api/kyc/loan_document/parser",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const submitdata = req.body.submitData;
      const userData = req.body.userData;
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          //company_code: userData.company_code,
          loan_schema_id: userData.loan_schema_id,
          product_id: userData.product_id,
          user_id: userData.user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.LOAN_DOCUMENT_XML_PARSER, submitdata, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
};
