"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../../constants/apiUrls");
const helper = require("../../utils/helper");
const passport = require("passport");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/msme/lead/submission-status/:loan_app_id/code/:codeId/sequence/:sequenceId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.query;
      const token = helper.generateToken({
        company_id: data.company_id,
        user_id: data.userId,
        product_id: data.product_id,
        type: 'dash'
       }, 60 * 5 * 1);
       const params=req.params
      
      axios
        .get(URLS.GET_MSME_SUBMISSION_STATUS_WATCHER + `/${params.loan_app_id}/code/${params.codeId}/sequence/${params.sequenceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          console.log(response, "repoanee")
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
  
  app.post("/api/msme/lead", (req, res) => {
    const data = req.body;
    const token = helper.generateToken({
      company_id: data.company_id,
      company_code: data.company_code,
      user_id: data.user_id,
      type: 'dash'
     }, 60 * 5 * 1);
    axios
      .post(URLS.CREATE_LOANID, data,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        res.send(response.data);
      }).catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while adding Product.",
        });
      });
  });

  app.post("/api/msme/lead/gstin/:loan_app_id", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        user_id: data.user_id,
        product_id: data.product_id,
        type: 'dash-api'
      },
      60 * 5 * 1
    );
    console.log(`${URLS.GST_ID_STATUS}/${data.loan_app_id}`, token)
    axios
      .post(`${URLS.GST_ID_STATUS}/${data.loan_app_id}`, data,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        res.send(response.data);
      }).catch((error) => {
          return res.status(400).send(error?.response?.data);
      });
  });

  app.get(
    "/api/msme/lead/:loan_app_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query= req.query;
      const user= JSON.parse(query['user']);
      const params = req.params;
      
      const token = helper.generateToken(
        {
          ...user,
          company_id: query.companyId,
          product_id: query.productId,
          user_id: user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .get(URLS.GET_BOOK_LOAN_DETAILS + `/${params.loan_app_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {  }
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
    "/api/msme/lead/:loan_app_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data= req.body;
      const params = req.params;
      const token = helper.generateToken(
        {
          ...data['user'],
          company_id: data.companyId,
          product_id: data.productId,
          user_id: data['user']._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .get(URLS.GET_BOOK_LOAN_DETAILS + `/${params.loan_app_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {  }
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
    "/api/msme/lead/:loan_app_id/document",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query= req.query;
      const user= JSON.parse(query['user']);
      const params = req.params;
      
      const token = helper.generateToken(
        {
          ...user,
          company_id: query.companyId,
          product_id: query.productId,
          user_id: user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .get(`${URLS.GET_BOOK_LOAN_DETAILS}/${params.loan_app_id}/document`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            borrower_id: query.borrowerId
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
    "/api/msme/loan",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
  
      const token = helper.generateToken(
        {
          company_id: req.body.companyId,
          product_id: req.body.productId,
          user_id: req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      const data = req.body.data;

      axios
        .post(`${URLS.POST_LOAN_DETAILS}`,data, {
          headers: {
            Authorization: `Bearer ${token}`,
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
}