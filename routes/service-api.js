"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const passport = require("passport");

module.exports = app => {
  app.use(bodyParser.json());
  app.post("/api/service", (req, res) => {
    axios
      .get(URLS.SERVICES)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while fetching services"
        });
      });
  });

  app.post("/api/service_invoice", (req, res) => {
    const data = req.body;
    axios
      .post(URLS.SERVICE_INVOICE, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "No records found for service usage"
        });
      });
  });

  app.put(
    "/api/service",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      axios
        .put(URLS.SERVICES, req.body)
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while updating service status"
          });
        });
    }
  );

  app.put(
    "/api/service/:_serviceId/:_serviceName/:_vendorName/:_section/:_url/:_type",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      const id = req.params._serviceId;
      const postData = {
        service_name: req.params._serviceName,
        vendor_name: req.params._vendorName,
        section: req.params._section,
        url: "api/" + req.params._url,
        type: req.params._type
      };
      helper.parseFileTojson(req, res, (err, parsedFile) => {
        postData.file = parsedFile;
        axios
          .put(`${URLS.SERVICES}/${id}`, postData)
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while posting service form."
            });
          });
      });
    }
  );

  app.get("/api/service/:_id", (req, res) => {
    const service_id = req.params._id;
    axios
      .get(`${URLS.SERVICES}/${service_id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while fetching service with id"
        });
      });
  });

  app.post(
    "/api/service/:_serviceName/:_vendorName/:_section/:_url/:_type",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      const postData = {
        service_name: req.params._serviceName,
        vendor_name: req.params._vendorName,
        section: req.params._section,
        url: "api/" + req.params._url,
        type: req.params._type
      };
      helper.parseFileTojson(req, res, (err, parsedFile) => {
        postData.file = parsedFile;
        axios
          .post(URLS.SERVICES, postData)
          .then(response => {
            res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while posting service form."
            });
          });
      });
    }
  );
};
