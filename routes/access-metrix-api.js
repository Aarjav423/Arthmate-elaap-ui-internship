"use strict";
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = app => {
  app.use(bodyParser.json());

  app.get("/api/access_metrix/:page/:limit", (req, res, next) => {
    const { page, limit } = req.params;
    axios
      .get(`${URLS.GET_ROLE_METRIX}/${page}/${limit}`)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response.data.message || "Something went wrong"
        });
      });
  });
};
