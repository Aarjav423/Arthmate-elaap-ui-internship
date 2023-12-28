"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/collection/users",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { page, limit, pagination,collection_agency_id,populate } = req.query;

      axios
        .get(URLS.GET_FOS_USERS, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params: { page, limit, pagination,collection_agency_id,populate }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/users/:userID",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { userID } = req.params;

      axios
        .get(`${URLS.GET_FOS_USERS}/${userID}`, {
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

  app.post(
    "/api/collection/user",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const token = helper.generateToken(
        {
          ...req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      const payload = {
        collection_agency_id: req.body.collection_agency_id,
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        pincode: req.body.pincode,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state
      };

      axios
        .post(URLS.ADD_FOS_USER, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    "/api/collection/user/:id",
    [passport.authenticate("jwt", { session: false })],
    async (req, res) => {
      const { id } = req.params;

      try {
        let payload = req.body;

        const token = helper.generateToken(
          {
            ...payload['user'],
            type: "dash-api",
          },
          60 * 5 * 1
        );

        delete payload['user'];
        delete payload['userId'];


        const response = await axios.patch(
          URLS.UPDATE_FOS_USER + `/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        res.send(response.data);
      } catch (error) {
        return res.status(400).send(error?.response?.data);
      }
    }
  );




};
