"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const fs = require("fs");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/repayment_reports/:page/:limit",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const data = req.body;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData?.company_id,
            user_id: userData?.user_id,
            product_id: data?.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.GET_REPAYMENT_REPORTS}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while getting repayment reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting repayment reports"
        });
      }
    }
  );

  app.post(
    "/api/repayment-report",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_REPAYMENT_REPORTS}`, data, {
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
                error.response.data.message ||
                "Error while generating repayment report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while generating repayment report."
        });
      }
    }
  );

  app.get(
    "/api/download-repayment-report/:id/:userId",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_REPAYMENT_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading repayment report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading repayment report"
        });
      }
    }
  );
};
