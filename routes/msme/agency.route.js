"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/msme/agencies",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(URLS.GET_AGENCIES_LIST, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params: {  }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
}