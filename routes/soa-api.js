"use strict";
const bodyParser = require("body-parser");
const passport = require("passport");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/soa-request/:company_id/:product_id/:loan_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { loan_id, company_id, product_id } = req.params;

      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: req.user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .get(`${URLS.GET_SOA_DETAILS}/${loan_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message: error.response.data.message || "Something went wrong",
          });
        });
    }
  );

  app.post(
    "/api/soa-request/generate/:company_id/:product_id/:loan_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { loan_id, company_id, product_id } = req.params;
      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: req.user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .post(
          `${URLS.GET_SOA_REQUEST}/${loan_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message: error.response.data.message || "Something went wrong",
          });
        });
    }
  );

  app.post(
    "/api/soa-request/download/:company_id/:product_id/:loan_id/:requestId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { loan_id, company_id, product_id , requestId} = req.params;
      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: req.user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .post(
          `${URLS.DOWNLOAD_SOA_REQUEST}/${requestId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob'
          }
        )
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message: error.response.data.message || "Something went wrong",
          });
        });
    }
  );
};
