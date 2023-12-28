"use strict";
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.put("/api/product_dues", [passport.authenticate("jwt", { session: false })], (req, res) => {
    try {
      const userData = req.body.userData;

      //generate token
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          user_id: userData.user_id,
          product_id: userData.product_id,
          type: "dash",
        },
        60 * 5 * 1
      );
      const prodData = req.body;
      axios
        .put(URLS.PRODUCT_DUE_CONFIG, prodData.submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message || "Error while getting axios product due configurations",
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: error.response.data.message || "Error while getting product due configurations",
      });
    }
  });

  app.post("/api/product_dues", [passport.authenticate("jwt", { session: false })], (req, res) => {
    const userData = req.body;
    //generate token
    const token = helper.generateToken(
      {
        company_id: userData.company_id,
        user_id: userData.user_id,
        product_id: userData.product_id,
        loan_schema_id: userData.loan_schema_id,
        type: "dash",
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.PRODUCT_DUE_CONFIG, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting product due configurations",
        });
      });
  });
};
