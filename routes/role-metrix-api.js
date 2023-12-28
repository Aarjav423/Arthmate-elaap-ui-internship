"use strict";
const {check, validationResult} = require("express-validator");
const axios = require("axios");
const helper = require("../utils/helper");
const auth = require("../services/auth/auth");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = app => {
  app.use(bodyParser.json());
  app.get("/api/role_metrix", (req, res, next) => {
    axios
      .get(URLS.GET_ROLE_METRIX)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response.data.message || "Something went wrong"
        });
      });
  });

  app.get("/api/role", (req, res, next) => {
    axios
      .get(URLS.GET_ROLE)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response.data.message || "Something went wrong"
        });
      });
  });

  app.get("/api/department", (req, res, next) => {
    axios
      .get(URLS.GET_DEPARTMENT)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response.data.message || "Something went wrong"
        });
      });
  });

  app.get("/api/designation", (req, res, next) => {
    axios
      .get(URLS.GET_DESIGNATION)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response.data.message || "Something went wrong"
        });
      });
  });

  app.post("/api/designation", (req, res) => {
    const designationData = req.body;
    axios
      .post(URLS.GET_DESIGNATION, designationData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while adding designation"
        });
      });
  });

  app.post("/api/department", (req, res) => {
    const departmentData = req.body;
    /** Method to submit  */
    axios
      .post(URLS.GET_DEPARTMENT, departmentData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while adding department"
        });
      });
  });

  app.post("/api/role", (req, res) => {
    const roleData = req.body;
    roleData.created_by=req.user.username
    roleData.updated_by=req.user.username
    /** Method to submit  */
    axios
      .post(URLS.GET_ROLE, roleData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding role"
        });
      });
  });

  app.post("/api/access_metrix", (req, res) => {
    const roleData = req.body;
    axios
      .post(URLS.ADD_ROLE_METRIX, roleData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while adding role matrix"
        });
      });
  });

  app.put("/api/access_metrix", (req, res) => {
    const roleData = req.body;
    axios
      .put(`${URLS.UPDATE_ROLE_METRIX}/${roleData._id}`, roleData)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).json({
          message:
            error.response?.data?.message ||
            "Error while updating aceess matrix"
        });
      });
  });
  
  app.put("/api/role/:id", (req, res, next) => {
    const {id} = req.params;
    const payload = req.body;
    payload.updated_by=req.user.username
    axios.put(`${URLS.UPDATE_ROLE}/${id}`,payload)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        return res.status(404).send({
          message: error.response?.data?.message || "Failed to update role"
        });
      });
  });
};
