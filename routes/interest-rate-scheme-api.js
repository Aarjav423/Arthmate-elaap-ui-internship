"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());
  
  app.post(
    "/api/scheme-list",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const data = req.body;
        const token = helper.generateToken(
          {
            user_id: data.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.INTEREST_RATE_SCHEME}/${Number(
              data?.page
            )}/${Number(data?.limit)}` + (data.search ? `?search=${data.search}`:``),
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
                "Error while fetching scheme details"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while fetching scheme details"
        });
      }
    }
  );

  app.put(
    "/api/scheme",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const data = req.body;
        const token = helper.generateToken(
          {
            user_id: data.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .put(
            `${URLS.INTEREST_RATE_SCHEME}/${Number(data.scheme_id)}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.status(200).send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while updating scheme details"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while updating scheme details"
        });
      }
    }
  );

  app.post(
    "/api/scheme",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const data = req.body;
        const token = helper.generateToken(
          {
            user_id: data.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(
            `${URLS.INTEREST_RATE_SCHEME}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.status(200).send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while posting scheme details"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while postting scheme details"
        });
      }
    }
  );
}