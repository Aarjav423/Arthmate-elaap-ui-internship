"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());
  //Api to fetch DPD reports
  app.post(
    "/api/dpd-report/:page/:limit",
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
            `${URLS.GET_DPD_REPORT}/${Number(data?.page)}/${Number(data?.limit)}`,
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
                "Error while getting DPD reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting DPD reports"
        });
      }
    }
  );
  
  //API to generate DPD report
  app.post(
    "/api/dpd-report",
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
            product_id: userData.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_DPD_REPORT}`, data, {
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
                "Error while generating DPD report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while generating DPD report"
        });
      }
    }
  );
  
  app.post("/api/download-dpd-report/:id/:userId",
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
          .get(`${URLS.DOWNLOAD_DPD_REPORT}/${req?.params.id}`, {
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
                "Error while downloading DPD report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading DPD report"
        });
      }
    }
  );
};
