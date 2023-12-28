"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");

module.exports = app => {
  app.use(bodyParser.json());
  app.get("/api/disbursement-channel-master", (req, res) => {
    try {
      axios
        .get(`${URLS.DISBUREMENT_CHANNEL_MASTER}`, {
          headers: {}
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res
            .status(400)
            .send(error.response.data || "Error while fetching list");
        });
    } catch (error) {
    }
  });
};
