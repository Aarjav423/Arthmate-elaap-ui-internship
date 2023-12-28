"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get("/api/company", (req, res) => {
    axios
      .get(URLS.LIST_COMPANIES)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting partners"
        });
      });
  });

  app.get("/api/loc-company", (req, res) => {
    axios
      .get(URLS.LIST_LOC_COMPANIES)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting partners"
        });
      });
  });

  app.get("/api/co-lender-company/:colenderId", (req, res) => {
    const co_lender_id = req.params.colenderId;
    axios
      .get(`${URLS.COLENDER_COMPANIES}/${co_lender_id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting partners"
        });
      });
  });

  app.get("/api/company/:id", (req, res) => {
    const company_id = req.params.id;
    axios
      .get(`${URLS.LIST_COMPANIES}/${company_id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting company"
        });
      });
  });

  app.post("/api/company", (req, res) => {
    const compData = req.body;
    axios
      .post(URLS.LIST_COMPANIES, compData)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding company"
        });
      });
  });
};
