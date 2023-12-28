"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post(
    "/api/repayment-record-v2",
    (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: data.company_id,
          product_id: data.product_id,
          user_id: data.user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(
          `${URLS.REPAYMENT_V2}`, [data], {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res
            .status(400)
            .send(error?.response?.data || "Error while repayment.");
        });
    }
  );
};
