"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());


    app.post(
      "/api/transaction_history_list/:loan_id",
      (req, res) => {
        const data = req.body;
        const token = helper.generateToken(
          {
            company_id: data.company_id,
            product_id: data.product_id,
            user_id: data.user_id,
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .post(
            `${URLS.TRANSACTION_HISTORY_LIST}/${data.loan_id}`, data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res
              .status(400)
              .send(error?.response?.data || "Error while fetching transaction history data.");
          });
      }
    );

    app.post(
      "/api/loc-drawdown-request/:loan_id/:page/:limit",
      (req, res) => {
        const data = req.body;
        const {loan_id, page, limit } =  req.params

        const token = helper.generateToken(
          {
            company_id: data.company_id,
            product_id: data.product_id,
            user_id: data.user_id,
            type: "dash-api",
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.DRAWDOWN_REQUEST_LIST}/${loan_id}/${page}/${limit}`, data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res
              .status(400)
              .send(error?.response?.data || "Error while fetching drawdown requests.");
          });
      }
    );
    app.post(
      "/api/loc-drawdown-request/:loan_id/:request_id",
      (req, res) => {
        const data = req.body;
        const {loan_id, request_id } =  req.params

        const token = helper.generateToken(
          {
            company_id: data.company_id,
            product_id: data.product_id,
            user_id: data.user_id,
            type: "dash-api",
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.DRAWDOWN_REQUEST_LIST}/${loan_id}/${request_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res
              .status(400)
              .send(error?.response?.data || "Error while fetching drawdown requests.");
          });
      }
    );
    app.put(
      "/api/reject-record-drawdown-request",
      (req, res) => {
        const data = req.body;
        const token = helper.generateToken(
          {
            company_id: data.company_id,
            product_id: data.product_id,
            user_id: data.user_id,
            type: "dash-api",
          },
          60 * 5 * 1
        );
        axios
          .put(
            `${URLS.REJECT_DRAWDOWN_REQUEST}`,data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res
              .status(400)
              .send(error?.response?.data || "Error while rejecting drawdown request.");
          });
      }
    );
};``
