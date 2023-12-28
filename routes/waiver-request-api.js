("use strict");
const { check, validationResult, body } = require("express-validator");
const helper = require("../utils/helper");
const axios = require("axios");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/waiver_request/:loan_id/:company_id/:product_id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { company_id, product_id, user_id } = req.params;
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
        .get(`${URLS.WAIVER_REQUEST_DETAILS_BY_ID_URL}/${req.params.loan_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while getting waiver request details."
          });
        });
    }
  );

  app.get(
    "/api/waiver-request-details/:loan_id/:sr_req_id/:company_id/:product_id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { company_id, product_id, user_id, loan_id, sr_req_id } =
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
          `${URLS.WAIVER_REQUEST_DETAILS_BY_REQ_ID_URL}/${loan_id}/${sr_req_id}`,
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
              "Error while getting waiver request details."
          });
        });
    }
  );

  app.post(
    "/api/waiver_request",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { company_id, product_id, user_id } = req.body.tokenData;
      const postData = req.body.postData;
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
        .post(URLS.WAIVER_REQUEST_URL, postData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while creating waiver request"
          });
        });
    }
  );

  app.post(
    "/api/waiver-request-status-update",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { company_id, product_id, user_id } = req.body;
      const postData = req.body.postData;
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
        .put(
          `${URLS.WAIVER_REQUEST_STATUS_UPDATE_URL}/${postData.id}`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while updating waiver request status"
          });
        });
    }
  );
};
