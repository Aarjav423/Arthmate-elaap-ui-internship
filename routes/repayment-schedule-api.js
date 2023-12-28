"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/repayment_schedule/:loan_id", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.REPAYMENT_SCHEDULE}/${data.loan_id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res
          .status(400)
          .send(
            error?.response?.data ||
              "Error while fetching repayment schedule data."
          );
      });
  });

  app.post("/api/repayment_schedule", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.BASE_URL}api/repayment_schedule`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res
          .status(400)
          .send(error?.response?.data || "Error while repayment schedule.");
      });
  });

  app.post("/api/loc-repayment-schedule/:loan_id", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.BASE_URL}api/loc-repayment-schedule/${data.loan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res
          .status(400)
          .send(
            error?.response?.data || "Error while getting repayment schedule."
          );
      });
  });

  app.post("/api/repayment-schedules/:loan_id/dues/:emi_no/", (req, res) => {
    try {
      const data = req.body;

      const token = helper.generateToken(
        {
          company_id: data.company_id,
          product_id: data.product_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .patch(
          `${URLS.BASE_URL}api/repayment-schedules/${data.loan_id}/dues/${data.emi_no}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res
            .status(400)
            .send(error?.response?.data || "Error while raising due.");
        });
    } catch (error) {}
  });
};
