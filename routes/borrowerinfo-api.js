"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/borrowerrecords",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const filter = req.body;
      const token = helper.generateToken(
        {
          company_id: filter.company_id,
          product_id: filter.product_id,
          loan_schema_id: filter.loan_schema_id,
          user_id: filter.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .post(`${URLS.GET_BORROWER_DETAILS_URL}`, filter, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message ||
              "Error while fetching borrower data."
          });
        });
    }
  );

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
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.BORROWER_INFO, [postData], {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
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
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.LOAN_DISBURSEMENT, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
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
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.BORROWER_INFO_STATUS}/${data.loan_id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json(error.response.data);
        });
    }
  );

  app.put(
    "/api/borrower_info_accept/",
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
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.BORROWER_INFO_STATUS}/accept/${data.loan_id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
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
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.BORROWER_INFO}`, req.body.postData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json(error.response.data);
        });
    }
  );

  app.put(
    "/api/da-approval",
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
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.DA_APPROVAL}`, req.body.postData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
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
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_LOAN_DATA_URL}/${req.params.klikbi}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error while fetching loan data."
          });
        });
    }
  );

  app.patch(
    "/api/bank-details/:loan_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;

      const payload = {
        borro_bank_name: data?.borro_bank_name,
        borro_bank_acc_num: data?.borro_bank_acc_num,
        borro_bank_ifsc: data?.borro_bank_ifsc,
        borro_bank_account_holder_name: data?.borro_bank_account_holder_name,
        borro_bank_account_type: data?.borro_bank_account_type,
        bene_bank_name: data?.bene_bank_name,
        bene_bank_acc_num: data?.bene_bank_acc_num,
        bene_bank_ifsc: data?.bene_bank_ifsc,
        bene_bank_account_holder_name: data?.bene_bank_account_holder_name,
        bene_bank_account_type: data?.bene_bank_account_type
      };

      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );

      axios
        .patch(`${URLS.UPDATE_BANK_DETAILS}/${req.params.loan_id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error updating bank details."
          });
        });
    }
  );

  app.patch(
    "/api/misc-details/:loan_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;

      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      delete data.company_id;
      delete data.product_id;
      delete data.user_id;
      delete data.loan_id;

      axios
        .patch(`${URLS.UPDATE_MISC_DETAILS}/${req.params.loan_id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          let message = "";
          if (error.response.data.data.unknownColumns) {
            error.response.data.data.unknownColumns.forEach(item => {
              message += `${Object.keys(item)[0]} - `;
            });
          }
          return res.status(400).json({
            message:
              `${error.response.data.message} ${message}` ||
              "Error updating misc details.",
            data: error.response.data.data
          });
        });
    }
  );

  app.patch(
    "/api/loan_nach/:loan_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );

      const payload = {
        umrn: data?.umrn || "",
        mandate_ref_no: data?.mandate_ref_no || "",
        nach_amount: data?.nach_amount || "",
        nach_registration_status: data?.nach_registration_status || "",
        nach_status_desc: data?.nach_status_desc || "",
        nach_account_holder_name: data?.nach_account_holder_name || "",
        nach_account_num: data?.nach_account_num || "",
        nach_ifsc: data?.nach_ifsc || "",
        nach_start: data?.nach_start || "",
        nach_end: data?.nach_end || ""
      };
      axios
        .patch(`${URLS.UPDATE_UMRN_DETAILS}/${req.params.loan_id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error updating UMRN details."
          });
        });
    }
  );

  app.post(
    "/api/get-customer-id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { loan_app_id, company_id, product_id, user_id } = req.body;
 
      const token = helper.generateToken(
        {
          user_id,
          company_id,
          product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_CUSTOMER_ID}/${loan_app_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          return res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message:
              error?.response?.data?.message ||
              "Error while getting customer details"
          });
        })
    }
  );

  app.patch(
    "/api/mark_repo",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;

      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      delete data.company_id;
      delete data.product_id;
      delete data.user_id;

      axios
        .patch(`${URLS.UPDATE_MARK_REPO}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error while updating Repo"
          });
        });
    }
  );
};
