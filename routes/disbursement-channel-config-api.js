"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get("/api/disbursement-channel-config/:_cid/:_pid", async (req, res) => {
    try {
      axios
        .get(
          `${URLS.DISBUREMENT_CHANNEL_CONFIG}/${req.params._cid}/${req.params._pid}`,
          {
            headers: {}
          }
        )
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res
            .status(400)
            .send(
              error.response.data ||
                "Error while fetching configured channel for this product"
            );
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error.response.data.message ||
          "Error while adding Disbursement channel."
      });
    }
  });

  app.post(
    "/api/disbursement-config",
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
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(URLS.DISBURSEMENTCHANNELCONFIG, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while adding Disbursement channel."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting Disbursement channel configurations"
        });
      }
    }
  );

  // API to configure colender disbursement channel.
  app.post(
    "/api/colender-disbursement-config",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            user_id: userData.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(URLS.COLENDER_DISBURSEMENT_CHANNEL_CONFIG_URL, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while adding colender disbursement channel."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while adding colender disbursement channel."
        });
      }
    }
  );

  app.post(
    "/api/disbursement_config_list",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const userData = req.body.userData;
      //generate token
      const token = helper.generateToken(
        {
          user_id: userData.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      // const data = req.body.userData.user_id;
      axios
        .post(URLS.DISBURSEMENTCHANNELLIST, userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.put(
    "/api/disbursement-config",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            product_id: userData.product_id,
            user_id: userData.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        const data = req.body.submitData;
        axios
          .put(`${URLS.DISBURSEMENTCHANNEL}/${data.id}`, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while updating disbursement channel configuration"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error || "Error while updating disbursement channel configuration"
        });
      }
    }
  );

  app.put(
    "/api/disbursement-config/status",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id || "",
            product_id: userData.product_id || "",
            user_id: userData.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        const data = req.body.submitData;
        let url = "";
        url =
          userData.company_id && userData.product_id
            ? `${URLS.DISBURSEMENTCHANNEL}/status/${data.id}`
            : `${URLS.DISBURSEMENTCHANNEL_COLENDER}/status/${data.id}`;
        axios
          .put(url, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while updating disbursement channel configuration status"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error ||
            "Error while updating disbursement channel configuration status"
        });
      }
    }
  );

  app.post(
    "/api/disbursement-config/:id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
        //generate token
        const token = helper.generateToken(
          {
            company_id: data.company_id,
            product_id: data.product_id,
            user_id: data.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );

        axios
          .delete(`${URLS.DISBURSEMENTCHANNEL}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while deleting disbursement channel configuration"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error || "Error while deleting disbursement channel configuration"
        });
      }
    }
  );
};
