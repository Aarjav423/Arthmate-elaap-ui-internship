"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/collection/dashboard/summary",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const {
        page,
        limit,
        pagination,
        assigned_start_date,
        assigned_end_date,
        sortBy,
        fosAgent,
        company_code
      } = req.query;

      axios
        .get(`${URLS.GET_DASHBOARD_FOS_USER}/summary`, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params: {
            page,
            limit,
            pagination,
            assigned_start_date,
            assigned_end_date,
            sortBy,
            fosAgent,
            company_code
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/dashboard/graph",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const queryParams = req.query;
      axios
        .get(URLS.GET_DEPOSITION_DATA, {
          params: queryParams,
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
  app.get(
    "/api/collection/dashboard/overview",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      axios
        .get(`${URLS.GET_DASHBOARD_CASE_OVERVIEW}`, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params: req.query
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );


};
