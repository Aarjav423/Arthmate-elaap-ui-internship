"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post(
    "/api/fetch_enum_fields",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          company_id: payload.company_id,
          product_id: payload.product_id,
          user_id: payload.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .post(`${URLS.LOAD_TEMPLATE_ENUMS}`, payload, {
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
              "Error while fetching enums fields."
          });
        });
    }
  );
};
