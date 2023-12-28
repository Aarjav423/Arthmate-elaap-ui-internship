"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/api/foreclosure-requests/:user_id/:company_id/:product_id/:request_type/:page/:limit",
    (req, res) => {
      try {
        const { company_id, user_id, product_id, request_type, page, limit } =
          req.params;
        const token = helper.generateToken(
          {
            company_id: company_id,
            user_id: user_id,
            product_id: product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.GET_FORECLOSURE_REQUEST}/${company_id}/${product_id}/${request_type}/${page}/${limit}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                `Error while getting ${request_type} requests`
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            `Error while getting ${request_type} requests`
        });
      }
    }
  );

  //API to fetch filtered foreclosure offer requets
  app.post(
    "/api/foreclosure-offer-requests/:user_id/:company_id/:product_id/:status/:page/:limit",
    (req, res) => {
      try {
        const { company_id, user_id, product_id, status, page, limit } =
          req.params;
        const token = helper.generateToken(
          {
            company_id: company_id,
            user_id: user_id,
            product_id: product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.GET_FORECLOSURE_OFFER_REQUEST}/${company_id}/${product_id}/${status}/${page}/${limit}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                `Error while getting foreclosure requests`
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            `Error while getting foreclosure requests`
        });
      }
    }
  );

  //API to fetch filtered waiver requests
  app.post(
    "/api/waiver-requests/:user_id/:company_id/:product_id/:status/:page/:limit",
    (req, res) => {
      try {
        const { company_id, user_id, product_id, status, page, limit } =
          req.params;
        const token = helper.generateToken(
          {
            company_id: company_id,
            user_id: user_id,
            product_id: product_id,
            type: "dash"
          },
          60 * 5 * 1
        );

        axios
          .get(
            `${URLS.GET_WAIVER_REQUEST}/${company_id}/${product_id}/${status}/${page}/${limit}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                `Error while getting waiver requests`
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message || `Error while getting waiver requests`
        });
      }
    }
  );

  app.post(
    "/api/waiver-requests-loan/:user_id/:company_id/:product_id/:status/:page/:limit/:loan_id",
    (req, res) => {
      try {
        const { company_id, user_id, product_id, status, page, limit, loan_id } =
          req.params;
        const token = helper.generateToken(
          {
            company_id: company_id,
            user_id: user_id,
            product_id: product_id,
            type: "dash"
          },
          60 * 5 * 1
        );

        axios
          .get(
            `${URLS.GET_WAIVER_REQUEST_LOAN}/${company_id}/${product_id}/${status}/${page}/${limit}/${loan_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                `Error while getting waiver requests`
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message || `Error while getting waiver requests`
        });
      }
    }
  );

  app.put(
    "/api/foreclosure-approve/:loan_id/:id/:sr_req_id/:is_approved",
    (req, res) => {
      try {
        const { company_id, user_id, product_id, remarks } = req.body;
        const { loan_id, id, sr_req_id, is_approved } = req.params;

        const token = helper.generateToken(
          {
            company_id: company_id,
            user_id: user_id,
            product_id: product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .put(
            `${URLS.SERVICE_REQUEST_ACTION}/${loan_id}/${id}/${sr_req_id}/${is_approved}`,
            { remarks },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message: error?.response?.data?.message || `Something went wrong`
            });
          });
      } catch (error) {
        return res.status(400).json({
          message: error.response.data.message || `Something went wrong`
        });
      }
    }
  );
};
