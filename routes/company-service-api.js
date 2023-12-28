"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const passport = require("passport");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get("/api/company_services/:_company_id", (req, res) => {
    const company_id = req.params._company_id;
    axios
      .get(`${URLS.COMPANY_SERVICES}/${company_id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({ message: error.response.data.message || "Error while fetching company services" });
      });
  });

  app.post("/api/company_services", (req, res) => {
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        type: "dash",
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.COMPANY_SERVICES, req.body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({ message: error.response.data.message || "Error while updating company services." });
      });
  });

  app.post("/api/company_services/pc/:_company_id", [passport.authenticate("jwt", { session: false })], (req, res) => {
    const reqData = req.body;
    const token = helper.generateToken(
      {
        company_id: req.params._company_id,
        type: "dash-api",
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.COMPANY_SERVICES}/get_service_pc`, reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({ message: error.response.data.message || "Error while downloading services postman collection." });
      });
  });
};
