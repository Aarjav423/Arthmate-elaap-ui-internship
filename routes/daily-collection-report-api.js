"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());
  //Api to fetch insurance billing reports
  app.post(
    "/api/daily-collection-report/:day/:month/:year/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
        //generate token
        const token = helper.generateToken(
          {
            company_id: data?.company_id,
            user_id: data?.user_id,
            product_id: data?.product_id,
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.GET_DAILY_COLLECTION_REPORT}/${
              data?.day?.toString() || null
            }/${(data?.month).toString()}/${Number(data?.year)}/${Number(
              data?.page
            )}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while getting daily collection reports.",
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting daily collection reports",
        });
      }
    }
  );

  app.post(
    "/api/lead-report/:day/:month/:year/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
        //generate token
        const token = helper.generateToken(
          {
            company_id: data?.company_id,
            user_id: data?.user_id,
            product_id: data?.product_id,
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.GET_DAILY_LEAD_REPORT}/${
              data?.day?.toString() || null
            }/${(data?.month).toString()}/${Number(data?.year)}/${Number(
              data?.page
            )}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while getting daily lead reports.",
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting daily lead reports",
        });
      }
    }
  );

  app.post(
    "/api/loan-report/:day/:month/:year/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
        //generate token
        const token = helper.generateToken(
          {
            company_id: data?.company_id,
            user_id: data?.user_id,
            product_id: data?.product_id,
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.GET_DAILY_LOAN_REPORT}/${
              data?.day?.toString() || null
            }/${(data?.month).toString()}/${Number(data?.year)}/${Number(
              data?.page
            )}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while getting daily loan reports.",
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting daily loan reports",
        });
      }
    }
  );

  app.post(
    "/api/download-daily-collection-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.userId,
            product_id: "",
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_DAILY_COLLECTION_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          })
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading daily collection report.",
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading daily collection report.",
        });
      }
    }
  );


  app.post(
    "/api/lead-reports/:id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: userData.user_id,
            product_id: "",
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_DAILY_LEAD_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "arraybuffer",
          })
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading daily lead report.",
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading daily lead report.",
        });
      }
    }
  );

  app.post(
    "/api/loan-reports/:id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: userData.user_id,
            product_id: "",
            type: "dash",
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_DAILY_LOAN_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "arraybuffer",
          })
          .then((response) => {
            return res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading daily loan report.",
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading daily loan report.",
        });
      }
    }
  );

};
