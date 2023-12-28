"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const passport = require("passport");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/anchor-list",
    [passport.authenticate("jwt", { session: false })],
    (req, res, next) => {
      const reqData = req.body;
      axios
        .get(
          `${URLS.ANCHOR_LIST}/${reqData.page}/${reqData.limit}/${reqData.str}`
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting anchor list"
          });
        });
    }
  );
  app.get("/api/anchor/:id", (req, res) => {
    /** Method to submit  */
    axios
      .get(`${URLS.ANCHOR_DETAILS}/${req.params.id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while fetching anchor details"
        });
      });
  });
  app.post("/api/anchor", (req, res) => {
    const anchorData = req.body;
    /** Method to submit  */
    axios
      .post(URLS.ADD_ANCHOR, anchorData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding anchor"
        });
      });
  });
  app.post("/api/anchor_doc", (req, res) => {
    const anchorData = req.body;
    /** Method to submit  */
    axios
      .post(URLS.VIEW_ANCHOR_DOCUMENT, anchorData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding anchor"
        });
      });
  });
  app.post("/api/fetchanchordocument", (req, res) => {
    try {
      const data = req.body;
      const token = helper.generateToken(
        {
          anchor_id: data.anchor_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.FETCH_ANCHOR_DOCUMENT}/${data.anchor_id}`, {
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
    }
  });
  app.post("/api/viewanchordocument", (req, res) => {
    try {
      const data = req.body;
      const token = helper.generateToken(
        {
          anchor_id: data.anchor_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );

      axios
        .post(
          `${URLS.VIEW_ANCHOR_DOCUMENT}`,
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
    }
  });
  app.post("/api/anchordocument", (req, res) => {
    let data = req.body;
    data.submitData.anchor_id = data.userData.anchor_id;
    const token = helper.generateToken(
      {
        anchor_id: data.userData.anchor_id,
        user_id: data.userData.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );

    axios
      .post(`${URLS.UPLOAD_ANCHOR_DOCUMENT}`, data.submitData, {
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
