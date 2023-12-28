"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const fs = require("fs");

module.exports = app => {
  app.use(bodyParser.json());
  //Api to fetch kyc compliance reports
  app.get(
    "/api/screen-reports/:page/:limit",
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
            `${URLS.GET_SCREEN_REPORTS}/${Number(req.params.page)}/${Number(
                req.params.limit
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
                "Error while getting Screen reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting Screen reports"
        });
      }
    }
  );

    // calling external api to generate screenn reports entry on reports page
    app.post(
        "/api/screen-report",
        [passport.authenticate("jwt", { session: false })],
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
                    .post(`${URLS.GENERATE_SCREEN_REPORT}`, data, {
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
                                "Error while generating screening report."
                        });
                    });
            } catch (error) {
                return res.status(400).json({
                    message:
                        error?.response?.data?.message ||
                        "Error while generating screening report"
                });
            }
        }
    );

   app.get(
    "/api/download-screen-report/:id/:userId",
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
          .get(`${URLS.DOWNLOAD_SCREEN_REPORT}/${req?.params.id}`, {
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
                "Error while downloading screening report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading screening report"
        });
      }
    }
  );
};
