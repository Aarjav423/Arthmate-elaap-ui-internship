"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get(
    "/api/analytics/companies",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      axios
        .get(`${URLS.FETCH_COMPANIES}`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:id/products",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.id}/products`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:id/leads",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.id}/leads`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:id/loans",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
    
      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.id}/loans`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:id/services",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.id}/services`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:id/dpd",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.id}/dpd`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:id/loans/disbursed",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.id}/loans/disbursed`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );


  app.get(
    "/api/analytics/companies/:companyId/products/:productId/leads",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.companyId}/products/${req.params.productId}/leads`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:companyId/products/:productId/loans",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
    
      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.companyId}/products/${req.params.productId}/loans`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:companyId/products/:productId/services",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.companyId}/products/${req.params.productId}/services`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:companyId/products/:productId/dpd",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.companyId}/products/${req.params.productId}/dpd`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  app.get(
    "/api/analytics/companies/:companyId/products/:productId/loans/disbursed",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {

      axios
        .get(`${URLS.FETCH_COMPANIES}/${req.params.companyId}/products/${req.params.productId}/loans/disbursed`, {
          headers: {
            Authorization: req.headers['authorization'],
          }
        })
        .then((response) => {
            console.log(response);
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching Company data.",
          });
        });
    }
  );

  /*
  app.post(
    "/api/borrower_info",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { options, postData } = req.body;
      const { company_id, company_code, loan_schema_id, product_id, user_id } =
        options;
      const token = helper.generateToken(
        {
          company_id,
          company_code,
          loan_schema_id,
          product_id,
          user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.BORROWER_INFO, [postData], {
          headers: {
            Authorization: req.headers['authorization'],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          // if (error?.response?.data?.data?.errorData?.data) {
          //   return res
          //     .status(400)
          //     .send(error.response.data.data.errorData.data);
          // } else {
            return res
              .status(400)
              .json(error.response.data || "Error while adding borrower info");
          //}
        });
    }
  );

  app.post(
    "/api/loan_disbursement",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: data.company_id,
          company_code: data.company_code,
          loan_schema_id: data.loan_schema_id,
          product_id: data.product_id,
          user_id: data.user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.LOAN_DISBURSEMENT, data, {
          headers: {
            Authorization: req.headers['authorization'],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res
            .status(400)
            .json(error.response.data || "Error while adding borrower info");
        });
    }
  );

  app.put(
    "/api/borrower_info/",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;
      //generate token
      const token = helper.generateToken(
        {
          company_id: data.company_id,
          product_id: data.product_id,
          user_id: data.user_id,
          loan_schema_id: data.loan_schema_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.BORROWER_INFO_STATUS}/${data.loan_id}`, data, {
          headers: {
            Authorization: req.headers['authorization'],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json(error.response.data);
        });
    }
  );

  app.put(
    "/api/borrower_info_update",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;
      //generate token
      const token = helper.generateToken(
        {
          company_id: data.options.company_id,
          product_id: data.options.product_id,
          user_id: data.user_id,
          loan_schema_id: data.options.loan_schema_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.BORROWER_INFO}`, req.body.postData, {
          headers: {
            Authorization: req.headers['authorization'],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json(error.response.data);
        });
    }
  );

  app.post(
    "/api/loan/:klikbi",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash",
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_LOAN_DATA_URL}/${req.params.klikbi}`, {
          headers: {
            Authorization: req.headers['authorization'],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          console.log("error", error)
          return res.status(400).json({
            message:
              error.response.data.message || "Error while fetching loan data.",
          });
        });
    }
  );
  */
};
