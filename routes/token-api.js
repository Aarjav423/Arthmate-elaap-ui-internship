"use strict";
const {check, validationResult} = require("express-validator");
const axios = require("axios");
const helper = require("../utils/helper");
const auth = require("../services/auth/auth");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = app => {
  app.use(bodyParser.json());
  app.get("/api/token", (req, res, next) => {
    axios
      .get(URLS.TOKENS)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response.data.message || "Error while fetching tokens"
        });
      });
  });

  app.get("/api/token/:company_id/:product_id/:co_lender_id", (req, res, next) => {
    axios
      .get(`${URLS.TOKENS}/${req.params.company_id}/${req.params.product_id}/${req.params.co_lender_id}`)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message:
            error.response.data.message ||
            "Error while fetching tokens by company_id"
        });
      });
  });

  app.put(
    "/api/token/:_id",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      axios
        .put(URLS.TOKENS, req.body)
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message: error.response.data.message || "Error while updating token"
          });
        });
    }
  );

  app.put(
    "/api/token_status",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      axios
        .put(`${URLS.TOKENS}/status`, req.body)
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message: error.response.data.message || "Error while updating token"
          });
        });
    }
  );

  app.post("/api/token_delete", (req, res) => {
    const data = req.body;
    axios
      .post(`${URLS.TOKENS}_delete`, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Error while deleting token"
        });
      });
  });
};
