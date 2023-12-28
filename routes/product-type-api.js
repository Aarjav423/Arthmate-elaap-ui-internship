"use strict";
const axios = require("axios");
const helper = require("../utils/helper");
const auth = require("../services/auth/auth");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = (app) => {
    app.use(bodyParser.json());
  
    app.get(
      "/api/product-type",
      [
        passport.authenticate("jwt", { session: false })
      ],
      (req, res, next) => {
        axios
          .get(URLS.GET_PRODUCT_TYPES)
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while getting user list",
            });
          });
      }
    );
}