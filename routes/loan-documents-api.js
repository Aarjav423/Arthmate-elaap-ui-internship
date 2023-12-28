"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post("/api/loandocument/:loan_id", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        //loan_schema_id: data.loan_schema_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.LOAN_DOCUMENTFETCH}`, req.body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(
            error?.response?.data || "Error fetching loan documents by loan id"
          );
      });
  });

  // To fetch all the drawdown documents of the particular loanid
  app.post("/api/drawdown_document/:loan_id", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        //loan_schema_id: data.loan_schema_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.FETCH_DRAWDOWN_DOCUMENT}`, req.body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(
            error?.response?.data || "Error fetching loan documents by loan id"
          );
      });
  });

  app.post(
    "/api/loan_documents",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const submitdata = req.body.submitData;
        const userData = req.body.userData;
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            //company_code: userData.company_code,
            loan_schema_id: userData.loan_schema_id,
            product_id: userData.product_id,
            user_id: userData.user_id,
            type: "dash-api"
          },
          60 * 5 * 1
        );

        const headersData = submitdata.code
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          : {
              Authorization: `Bearer ${token}`
            };

        axios
          .post(URLS.LOAN_DOCUMENT, submitdata, {
            headers: headersData
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).send(error?.response?.data);
          });
      } catch (error) {
      }
    }
  );

  // To upload a drawdown document corresponding to an usage/request Id and loanid
  app.post(
    "/api/drawdown_document",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const submitdata = req.body.submitData;
      const userData = req.body.userData;
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          //company_code: userData.company_code,
          loan_schema_id: userData.loan_schema_id,
          product_id: userData.product_id,
          user_id: userData.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.DRAWDOWN_DOCUMENT, submitdata, {
          headers: {
            Authorization: `Bearer ${token}`
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
  app.post("/api/view_doc", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.VIEW_LOAN_DOCUMENT, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting docs"
        });
      });
  });

  app.get("/api/loandocument", (req, res) => {
    const data = req.query;
    const userData = JSON.parse(data.user)
    const loanAppID = data.loanAppID;
    const token = helper.generateToken(
      {
        ...userData,
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: userData._id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.FETCH_LOAN_DOCUMENT}/${loanAppID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params:data,
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).send(error?.response?.data);
      });
  }
  );
};
