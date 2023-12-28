"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/topup-disbursement-channel", (req, res) => {
    try {
      const userData = req.body.userData;
      //generate token
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          user_id: userData.user_id,
          product_id: userData.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const data = req.body.submitData;
      axios
        .post(URLS.TOPUP_DISBURSEMENT, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message ||
              "Error while adding topup Disbursement."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message ||
          "Error while adding topup Disbursement."
      });
    }
  });

  app.post("/api/disbursement-channel-master", (req, res) => {
    const userData = req.body.userData;
    const token = helper.generateToken(
      {
        user_id: userData.user_id,
        company_id: userData.company_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .get(URLS.ONBOARD_DISBURSEMENT, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting disbursement channel list."
        });
      });
  });

  app.post("/api/disbursement-channel-master/delete/:id", (req, res) => {
    const userData = req.body.userData;
    const token = helper.generateToken(
      {
        user_id: userData.user_id,
        company_id: userData.company_id,
        type: "dash"
      },
      60 * 5 * 1
    );

    axios
      .delete(`${URLS.ONBOARD_DISBURSEMENT}/${req.params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while deliting disbursement channel."
        });
      });
  });

  app.post("/api/disbursement-channel-master/add", (req, res) => {
    const userData = req.body.userData;
    const data = req.body.submitData;
    const token = helper.generateToken(
      {
        user_id: userData.user_id,
        company_id: userData.company_id,
        type: "dash"
      },
      60 * 5 * 1
    );

    axios
      .post(`${URLS.ONBOARD_DISBURSEMENT}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while adding disbursement channel."
        });
      });
  });

  app.put("/api/disbursement-channel-master/:id", (req, res) => {
    const userData = req.body.userData;
    const data = req.body.submitData;
    const token = helper.generateToken(
      {
        user_id: userData.user_id,
        company_id: userData.company_id,
        type: "dash"
      },
      60 * 5 * 1
    );

    axios
      .put(`${URLS.ONBOARD_DISBURSEMENT}/${req.params.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while updating disbursement channel."
        });
      });
  });

  app.post("/api/composite_disbursement", (req, res) => {
    try {
      const userData = req.body.userData;
      //generate token
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          user_id: userData.user_id,
          product_id: userData.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const data = req.body.submitData;
      axios
        .post(URLS.COMPOSIT_DISBURSEMENT, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message ||
              "Error while adding Disbursement."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message || "Error while adding Disbursement."
      });
    }
  });

  app.post("/api/get-loans-by-status", (req, res) => {
    const data = req.body.sendData;
    const userData = req.body.userData;
    //generate token
    const token = helper.generateToken(
      {
        company_id: userData?.company_id,
        user_id: userData?.user_id,
        product_id: data?.product_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.GET_DISBURSAL_APPROVED_RECORD, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while geting disbursal approved list"
        });
      });
  });

  app.post("/api/unprocessed-requests", (req, res) => {
    const data = req.body.sendData;
    const userData = req.body.userData;
    //generate token
    const token = helper.generateToken(
      {
        company_id: userData?.company_id,
        user_id: userData?.user_id,
        product_id: data?.product_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.GET_UNPROCESSED_REQUEST, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting unprocessed request list"
        });
      });
  });

  app.post("/api/composite_drawdown", (req, res) => {
    try {
      const userData = req.body.userData;
      //generate token
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          user_id: userData.user_id,
          product_id: userData.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const data = req.body.submitData;
      axios
        .post(URLS.COMPOSITE_DRAWDOWN, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in composite drawdown."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message || "Error in composite drawdown."
      });
    }
  });

  app.post("/api/process-drawdown-pf", (req, res) => {
    try {
      const { userData, submitData } = req.body;
      //generate token
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          user_id: userData.user_id,
          product_id: userData.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.PROCESS_DRAWDOWN_PF, submitData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in composite drawdown."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message || "Error in process drawdown PF."
      });
    }
  });

  app.post("/api/record-drawdown-request", (req, res) => {
    try {
      const userData = req.body.userData;
      //generate token
      const token = helper.generateToken(
        {
          company_id: userData.company_id,
          user_id: userData.user_id,
          product_id: userData.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      let data = req.body.submitData;
      data.repayment_days = Number(data.repayment_days);
      data.no_of_emi = Number(data.no_of_emi);
      data.drawdown_amount = Number(data.drawdown_amount);
      data.usage_fees_including_gst = Number(data.usage_fees_including_gst);
      data.net_drawdown_amount = Number(data.net_drawdown_amount);
      data.repayment_days = Number(data.repayment_days);
      axios
        .post(URLS.BATCH_DISBURSEMENT, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in record drawdown."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: error?.response?.data?.message || "Error in record drawdown."
      });
    }
  });

  app.post("/api/bank-details/:page/:limit", (req, res) => {
    try {
      //generate token
      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          user_id: req.body.user_id,
          product_id: req.body.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.FETCH_BANK_DETAILS}/${req.params.page}/${req.params.limit}?search=${req.query.search}&status=${req.query.status}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in fetching bank details."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message || "Error in fetching bank details."
      });
    }
  });

  app.post("/api/product-schemes/:page/:limit", (req, res) => {
    try {
      //generate token
      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          user_id: req.body.user_id,
          product_id: req.body.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.FETCH_SCHEME_DETAILS}/${req.params.page}/${req.params.limit}?product_id=${req.query.product_id}&scheme_id=${req.query.scheme_id}&status=${req.query.status}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error in fetching Scheme details."
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message || "Error in fetching Scheme details."
      });
    }
  });

  app.put("/api/update-record-drawdown-request", (req, res) => {
    try {
      //generate token
      const data=req.body;
      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          user_id: req.body.user_id,
          product_id: req.body.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .put(URLS.UPDATE_DRAWDOWN_REQUEST,data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message
      });
    }
  });

  app.post("/api/calculate-net-drawdown-amount", (req, res) => {
    try {
      //generate token
      const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          user_id: req.body.user_id,
          product_id: req.body.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const payload = req.body
      axios
        .post(`${URLS.CALCULATE_NET_DRAWDOWN_AMOUNT}`,payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error?.response?.data?.message || "Error while calculating amount"
          });
        });
    } catch (error) {
      return res.status(400).json({
        message:
          error?.response?.data?.message || "Error while calculating amount"
      });
    }
  });

};
