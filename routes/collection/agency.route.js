"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/collection/agencies",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(URLS.GET_AGENCIES_LIST, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params: req.query
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
  app.post(
    "/api/collection/agency",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .post(URLS.CREATE_COLLECTION_AGENCY, req.body, {
          headers: {
            Authorization: req.headers["authorization"],
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
  app.patch(
    "/api/collection/agency/:agencyId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const agencyId = req.params.agencyId;
      let payload = req.body;

      const token = helper.generateToken(
        {
          ...payload['user'],
          type: "dash-api",
        },
        60 * 5 * 1
      );
      delete payload['user'];
      axios
        .patch(`${URLS.UPDATE_COLLECTION_AGENCY}/${agencyId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
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
}