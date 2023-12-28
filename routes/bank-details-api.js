"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/bank-details/:page/:limit/:search",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        //generate token
        const token = helper.generateToken(
          {
            company_id: '',
            user_id: req?.body?.user_id,
            product_id: '',
            type: "dash"
          },
          60 * 5 * 1
        );
        const queryParams = {
          search: req?.params?.search || ""
        };
        axios
          .get(`${URLS.GET_BANK_ACCOUNT_HOLDER_NAMES}/${req?.params.page}/${req?.params.limit}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: queryParams
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Not able to fetch account holder names."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while getting account holder names."
        });
      }
    }
  );

  app.post(
    "/api/bank-details",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const body = req.body;
      const token = helper.generateToken(
        {
          company_id: "",
          product_id: "",
          user_id: body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      delete body.user_id;
      axios
        .post(`${URLS.GET_BANK_ACCOUNT_HOLDER_NAMES}`, body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              error.response.data ||
              "Error while inserting data."
          });
        });
    }
  );

  app.put(
    "/api/bank-details",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const body = req.body;
      const id = req.body.id;
      const token = helper.generateToken(
        {
          company_id: "",
          product_id: "",
          user_id: body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      delete body.user_id;
      delete body.id;
      axios
        .put(`${URLS.GET_BANK_ACCOUNT_HOLDER_NAMES}/${id}`, body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
            error.response.data.message ||
            error.response.data ||
              "Error while Updating data."
          });
        });
    }
  );
};
