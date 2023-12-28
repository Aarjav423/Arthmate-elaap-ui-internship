"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());

  app.get("/api/loanschema/:_id", (req, res) => {
    axios
      .get(`${URLS.LOAN_SCHEMA}/${req.params._id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting loan schema by company id "
        });
      });
  });

  app.post("/api/loanschema", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.LOAN_SCHEMA, data, {
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
            error.response.data.message || "Error while adding loan schema."
        });
      });
  });

  app.put("/api/loanschema", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        user_id: data.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .put(`${URLS.LOAN_SCHEMA_UPDATE}`, data, {
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
            error?.response?.data?.message ||
            "Error while updating loan schema."
        });
      });
  });
};
