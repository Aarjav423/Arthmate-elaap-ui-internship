"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const passport = require("passport");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());

  app.post(
    "/api/partner-list",
    [passport.authenticate("jwt", { session: false })],
    (req, res, next) => {
      const reqData = req.body;
      axios
        .get(
          `${URLS.PARTNER_LIST}/${reqData.page}/${reqData.limit}/${reqData.str}`
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting partner list"
          });
        });
    }
  );

  app.get("/api/partner/:id", (req, res) => {
    /** Method to submit  */
    axios
      .get(`${URLS.PARTNER_DETAILS}/${req.params.id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        console.log("error", error);
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while fetching partner details"
        });
      });
  });

  app.post("/api/partner", (req, res) => {
    const partnerData = req.body;
    /** Method to submit  */
    axios
      .post(URLS.ADD_PARTNER, partnerData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding partner"
        });
      });
  });

  // view Part doc

  app.post("/api/partner_doc", (req, res) => {
    const partnerData = req.body;
    /** Method to submit  */
    axios
      .post(URLS.VIEW_PART_DOCUMENT, partnerData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding partner"
        });
      });
  });
};
