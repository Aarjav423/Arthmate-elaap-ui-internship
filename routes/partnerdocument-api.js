"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());
  // upload part doc
  app.post("/api/fetchpartnerdocument", (req, res) => {
    try {
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: data.company_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.FETCH_PART_DOCUMENT}/${data.company_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message: error.response.data.message || "Something went wrong"
          });
        });
    } catch (error) {
      console.log("error", error);
    }
  });
  app.post("/api/viewpartnerdocument", (req, res) => {
    try {
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: data.company_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );

      axios
        .post(
          `${URLS.VIEW_PART_DOCUMENT}`,
          { awsurl: data.file_url },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message: error.response.data.message || "Something went wrong"
          });
        });
    } catch (error) {
      console.log("error", error);
    }
  });
  app.post("/api/partnerdocument", (req, res) => {
    let data = req.body;
    data.submitData.company_id = data.userData.company_id;
    const token = helper.generateToken(
      {
        company_id: data.userData.company_id,
        user_id: data.userData.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );

    axios
      .post(`${URLS.UPLOAD_PART_DOCUMENT}`, data.submitData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Something went wrong"
        });
      });
  });
};
