"use strict";
const bodyParser = require("body-parser");
const passport = require("passport");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");


module.exports = (app) => {
    app.use(bodyParser.json());
    app.post("/api/cash-collateral/:page/:limit",  [passport.authenticate("jwt", { session: false })], (req, res) => {
        try {
          const token = helper.generateToken(
            {
              company_id: req.body.company_id,
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              user_id: req.user._id,
              type: "dash"
            },
            60 * 5 * 1
          );
          axios
            .get(`${URLS.CASH_COLLATERAL_DETAILS}/${req.params.page}/${req.params.limit}?company_id=${req.query.company_id}&product_id=${req.query.product_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => {
              return res.send(response.data);
            })
            .catch(error => {
              return res.status(400).json({
                message:
                  error?.response?.data?.message || "Error in fetching cash-collateral."
              });
            });
        } catch (error) {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in fetching cash-collateral"
          });
        }
      });

      app.post("/api/v2/disburse_withheld_amount",[passport.authenticate("jwt", { session: false })], (req, res) => {
        try {
          const data = req.body;
          const token = helper.generateToken(
            {
              company_id: req.body.company_id,
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              user_id: req.user._id,
              type: "dash"
            },
            60 * 5 * 1
          );
          axios
            .post(URLS.POST_DISBURSE_WITHHELD_AMOUNT, data, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => {
              return res.send(response.data);
            })
            .catch(error => {
              return res.status(400).json({
                message:
                  error?.response?.data?.message || "Error in disburse_withheld_amount."
              });
            });
        } catch (error) {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in disburse_withheld_amount."
          });
        }
      });
  };

