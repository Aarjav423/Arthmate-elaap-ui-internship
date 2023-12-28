"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/repayment_schedule_reports/:page/:limit",
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
            `${URLS.GET_REPAYMENT_SCHEDULE_REPORTS}/${Number(data?.page)}/${Number(
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
            console.log(error);
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting repayment schedule reports data."
            });
          });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while getting repayment schedule reports"
        });
      }
    }
  );
  
  app.post(
    "/api/repayment-schedule-report",
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
          .post(`${URLS.GENERATE_REPAYMENT_SCHEDULE_REPORTS}`, data, {
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
                "Error while generating repayment schedule report."
            });
          });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while generating repayment schedule report."
        });
      }
    }
  );
  
  app.get(
    "/api/download-repayment-schedule-report/:id/:userId",
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
          .get(`${URLS.DOWNLOAD_REPAYMENT_SCHEDULE_REPORTS}/${req?.params.id}`, {
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
                "Error while downloading repayment schedule report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading repayment schedule report"
        });
      }
    }
  );
};
