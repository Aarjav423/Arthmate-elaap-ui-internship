"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  // API to fetch charge types
  app.get("/api/charge-types/:user_id", (req, res) => {
    const { user_id } = req.params;
    const token = helper.generateToken(
      {
        user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .get(URLS.GET_CHARGE_TYPES, {
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
            error.response.data.message || "Error while getting charge types."
        });
      });
  });

  // API to apply charge
  app.post("/api/apply-charge", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.APPLY_CHARGE}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while applying charge."
        });
      });
  });
  app.post("/api/charges/", (req, res) => {
    const { loan_id, company_id, product_id, user_id } = req.body;
    const token = helper.generateToken(
      {
        loan_id,
        company_id,
        product_id,
        user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.GET_CHARGE}/${company_id}/${product_id}/${loan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting charges."
        });
      });
  });
};
