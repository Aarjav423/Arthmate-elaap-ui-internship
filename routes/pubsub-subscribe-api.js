"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
module.exports = app => {
  app.use(bodyParser.json());

  //SUBSCRIBE_EVENT;
  app.get("/api/subscribe_event/:_comp_code", (req, res) => {
    const company_code = req.params._comp_code;
    axios
      .get(URLS.SUBSCRIBE_EVENT + `/${company_code}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while geting subscribed event list"
        });
      });
  });

  app.post("/api/subscribe_event", (req, res) => {
    const userData = req.body.userData;
    const data = req.body.submitData;
    //generate token
    const token = helper.generateToken(
      {
        company_id: userData.company_id,
        user_id: userData.user_id,
        product_id: userData.product_id,
        type: "dash",
      },
      60 * 5 * 1
    );

    axios.post(URLS.SUBSCRIBE_EVENT, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

  app.put("/api/subscribe_event/_id", (req, res) => {
    const data = req.body;
    axios
      .put(URLS.SUBSCRIBE_EVENT, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while updating subscribe event"
        });
      });
  });

  app.delete("/api/subscribe_event/_id", (req, res) => {
    const data = req.body;
    axios
      .delete(URLS.SUBSCRIBE_EVENT, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while deleting subscribe event"
        });
      });
  });
};
