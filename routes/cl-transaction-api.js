"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const passport = require("passport");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post(
    "/api/cl_record",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const userData = req.body.userData;
      const submitData = req.body.submitData;
      const token = helper.generateToken(
        {
          user_id: userData.user_id,
          company_id: userData.company_id,
          product_id: userData.product_id,
          type: "dash",
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.ADD_LOAN_TXN_URL, submitData, {
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
              error.response.data.message ||
              "Error while recording loan transaction data.",
          });
        });
    }
  );

  app.post(
    "/api/disbursement_record",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const submitData = req.body;
      const token = helper.generateToken(
        {
          user_id: submitData?.user_id,
          company_id: submitData?.company_id,
          product_id: submitData?.product_id,
          type: "dash",
        },
        60 * 5 * 1
      );
      axios.get(`${URLS.DISBURSEMENT_RECORD}/${submitData?.company_id}/${submitData?.product_id}/${submitData?.record_method}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        res.send(response.data);
      }).catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while fetching disbursement records.",
        });
      });
    }
  )
};
