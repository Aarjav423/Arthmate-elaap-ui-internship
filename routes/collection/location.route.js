"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/collection/location/pincodes",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { q } = req.query;

      axios
        .get(`${URLS.GET_LOCATION}/pincodes`, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params:{
            q
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
};
