"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/send_enhanced_review", (req, res) => {
    const postData = req.body;
    const {
      company_id,
      product_id,
      loan_schema_id,
      user_id
    } = postData;

    const token = helper.generateToken({
      company_id,
      product_id,
      loan_schema_id,
      user_id,
      type: "dash-api"
    },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.BASE_URL}api/send_enhanced_review`, postData, {
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
          .send(error.response?.data || "Error while sending for enhanced review.");
      });
  });
};
