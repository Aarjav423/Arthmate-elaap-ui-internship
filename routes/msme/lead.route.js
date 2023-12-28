"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/msme/lead/:loan_app_id/review",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query = req.query;
      const user = JSON.parse(query["user"]);

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
        .get(`${URLS.GET_MSME_LEADS}/${req.params.loan_app_id}/review/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.put(
    "/api/msme/lead/:loan_app_id/status_update/:status",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query = {
        remarks: req.body.remarks,
      };
      const token = helper.generateToken(
        {
          company_id: req.body.companyId,
          product_id: req.body.productId,
          user_id: req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .put(
          `${URLS.GET_MSME_LEADS}/${req.params.loan_app_id}/status_update/${req.params.status}`,
          query,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {},
          }
        )
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/msme/activity-logs/:loan_app_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query = req.query;
      const user = JSON.parse(query["user"]);

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
        .get(`${URLS.GET_MSME_ACTIVITY_LOGS}/${req.params.loan_app_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
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
    "/api/msme/add-comment",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;
      const user = data["user"];

      let token_data = {
        ...user,
        user_id: user._id,
        company_id: req.body.companyId,
        product_id: req.body.productId,
      };

      const token = helper.generateToken(
        {
          ...token_data,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .post(`${URLS.GET_MSME_LEADS}/${data.loan_app_id}/section/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res
            .status(400)
            .send(error.response.data || "Error while saving comment details");
        });
    }
  );

  app.get(
    "/api/msme/lead/:loan_app_id/section",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query = req.query;
      const user = JSON.parse(query["user"]);

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
        .get(`${URLS.GET_MSME_LEADS}/${req.params.loan_app_id}/section`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
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
    "/api/msme/lead/:loan_app_id/offer",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body.payload;

      const token = helper.generateToken(
        {
          ...payload.user,
          company_id: payload.companyId,
          product_id: payload.productId,
          user_id: payload.user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .get(`${URLS.GET_MSME_LEADS}/${req.params.loan_app_id}/offer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
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
    "/api/msme/loan/calculateFeesAndCharges",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          company_id: payload.companyId,
          product_id: payload.productId,
          user_id: payload.user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(`${URLS.FETCH_FEES_AND_CHARGES_DETAILS}`,payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    "/api/msme/lead/:loan_app_id/update-section",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body;

      const token = helper.generateToken(
        {
          ...payload.user,
          company_id: payload.companyId,
          product_id: payload.productId,
          user_id: payload.user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(`${URLS.UPDATE_SCETION_KYC}/okyc`, 
        {
          loan_app_id:req.params.loan_app_id,
          status: payload.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    "/api/msme/leads/okyc-aadhar-otp",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body.payload;
      const token = helper.generateToken(
        {
          company_id: payload.company_id,
          product_id: payload.product_id,
          user_id: payload.user_id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(`${URLS.SEND_MSME_AADHAAR_OTP}`, 
        {
          loan_app_id: payload.loan_app_id,
          aadhaar_no: payload.aadhaar_no,
          section_code: payload.section_code,
          section_sequence_no: payload.section_sequence_no
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    "/api/msme/activity-logs",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const body = req.body

      const payload = {
        type: body.type,
        remarks: body.remarks,
        loan_app_id: body.loan_app_id,
        category: body.category
      };

      const token = helper.generateToken(
        {
          company_id: body.companyId,
          product_id: body.productId,
          user_id: body.user._id?body.user._id:body.user.id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .post(
          `${URLS.PATCH_MSME_COMMENT_DETAILS}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

};
