"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
module.exports = app => {
  app.use(bodyParser.json());

  //SUBSCRIBE_EVENT;
  app.get("/api/broadcast_event/", (req, res) => {
    axios
      .get(URLS.BROADCAST_EVENT)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while geting brodcast event list"
        });
      });
  });

  app.post("/api/broadcast_event", (req, res) => {
    const data = req.body;
    axios
      .post(URLS.BROADCAST_EVENT, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while adding broadcast event"
        });
      });
  });

  app.put("/api/broadcast_event/:_id", (req, res) => {
    const data = req.body;
    console.log(
      "`${URLS.BROADCAST_EVENT}/${req.params._id}`",
      `${URLS.BROADCAST_EVENT}/${req.params._id}`
    );
    axios
      .put(`${URLS.BROADCAST_EVENT}/${req.params._id}`, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while updating broadcast event"
        });
      });
  });

  app.put("/api/broadcast_event/:_id/:_status", (req, res) => {
    const data = req.body;
    console.log(
      "`${URLS.BROADCAST_EVENT}/${req.params._id}`",
      `${URLS.BROADCAST_EVENT}/${req.params._id}/${req.params._status}`
    );
    axios
      .put(
        `${URLS.BROADCAST_EVENT}/${req.params._id}/${req.params._status}`,
        data
      )
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while updating broadcast event"
        });
      });
  });

  app.delete("/api/broadcast_event/:_id", (req, res) => {
    const data = req.body;
    axios
      .delete(URLS.BROADCAST_EVENT, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while deleting broadcast event"
        });
      });
  });
};
