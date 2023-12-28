"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
const fs = require("fs");

module.exports = app => {
  app.use(bodyParser.json());
  app.post(
    "/api/disbursement_reports/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_REPORTS}/${Number(data?.page)}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );

  app.post(
    "/api/disbursement-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_REPORTS}`, data, {
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
                "Error while generating report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while generating report"
        });
      }
    }
  );

  app.get(
    "/api/download-disbursement-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.post(
    "/api/co-lender-disbursement-reports/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_CO_LENDER_REPORTS}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting escrow reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );

  app.post(
    "/api/co-lender-escrow-disbursement-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
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
        axios
          .post(`${URLS.GENERATE_CO_LENDER_REPORTS}`, data, {
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
                "Error while generating escrow report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while generating escrow report"
        });
      }
    }
  );

  app.get(
    "/api/co-lender-download-disbursement-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_CO_LENDER_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading escrow report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.get(
    "/api/co-lender-loans-report/:colenderId/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.DOWNLOAD_CO_LENDER_LOANS_REPORTS}/${req?.params.colenderId}/${req?.params.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              responseType: "blob"
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading escrow report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.post(
    "/api/borrower-disbursement-reports/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_BORROWER_REPORTS}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting borrower reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while getting borrower reports"
        });
      }
    }
  );

  app.post(
    "/api/borrower-disbursement-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
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
        axios
          .post(`${URLS.GENERATE_BORROWER_REPORTS}`, data, {
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
                "Error while generating borrower report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while generating borrower report"
        });
      }
    }
  );

  app.get(
    "/api/borrower-download-disbursement-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_BORROWER_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading borrower report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading borrower report"
        });
      }
    }
  );

  // calling external api to generate ckyc reports entry on reports page
  app.post(
    "/api/ckyc_report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
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
        axios
          .post(`${URLS.GENERATE_CKYC_REPORT}`, data, {
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
                "Error while generating ckyc report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while generating ckyc report"
        });
      }
    }
  );

  // calling external api to download ckyc zip file when clicking on download icon
  app.get(
    "/api/download_ckyc_report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_CKYC_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "arraybuffer"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading ckyc report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  // calling external api to get all ckyc reports lists on reports page
  app.post(
    "/api/ckyc_report/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_CKYC_REPORTS}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting ckyc reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );

  app.get(
    "/api/download-processed-bank-files/:id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_UTR_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading borrower report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading borrower report"
        });
      }
    }
  );

  app.post(
    "/api/cbi/data",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GET_ZIP_FILES}`, req.body, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while fetcing zip files"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while fetcing zip files"
        });
      }
    }
  );

  app.post(
    "/api/cbi/data/download",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.DOWNLOAD_ZIP_FILE}`, req.body, {
            responseType: "arraybuffer",
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
                "Error while downloading zip file"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while download zip file"
        });
      }
    }
  );

  //Drawdown Loc Report

  app.post(
    "/api/loc-drawdown-reports/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_LOC_REPORTS}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );

  app.post(
    "/api/loc-drawdown-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.LOC_REPORTS}`, data, {
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
                "Error while generating report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while generating report"
        });
      }
    }
  );

  app.get(
    "/api/download-loc-drawdown-reports/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_LOC_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  //Refund report API's

  app.get(
    "/api/download-refund-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_REFUND_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.post(
    "/api/refund-transaction-report/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.REFUND_TRANSACTION_REPORT}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );
  app.post(
    "/api/generate-refund-transaction-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_REFUND_REPORT}`, data, {
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
                "Error while generating report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while generating report"
        });
      }
    }
  );

  // Insurance report API's
  app.get(
    "/api/download-insurance-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_INSURANCE_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.post(
    "/api/insurance-transaction-report/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.INSURANCE_TRANSACTION_REPORT}/${Number(
              data?.page
            )}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );
  app.post(
    "/api/generate-insurance-transaction-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_INSURANCE_REPORT}`, data, {
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
                "Error while generating report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while generating report"
        });
      }
    }
  );
  //

  // Disbursement in progress report API's
  app.get(
    "/api/download-disbursement-inprogress-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.DOWNLOAD_DISBURSEMENT_INPROGRESS_REPORT}/${req?.params.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              responseType: "blob"
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.post(
    "/api/disbursement-inprogress-report/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.LIST_DISBURSEMENT_INPROGRESS_REPORT}/${Number(
              data?.page
            )}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );
  app.post(
    "/api/generate-disbursement-inprogress-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_DISBURSEMENT_INPROGRESS_REPORT}`, data, {
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
                "Error while generating report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while generating report"
        });
      }
    }
  );
  //

  // Cibil report API's
  app.get(
    "/api/download-cibil-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_CIBIL_TRANSACTION_REPORT}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
              responseType:"arraybuffer"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while downloading report"
        });
      }
    }
  );

  app.post(
    "/api/cibil-transaction-report/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .post(
            `${URLS.CIBIL_TRANSACTION_REPORT}/${Number(data?.page)}/${Number(
              data?.limit
            )}`, data,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );
  //

  app.post(
    "/api/disbursement_reports/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_REPORTS}/${Number(data?.page)}/${Number(data?.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting reports"
        });
      }
    }
  );

  //api to generate p2p report
  app.post(
    "/api/p2p-report",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData.company_id,
            user_id: userData.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(`${URLS.GENERATE_P2P_REPORTS}`, data, {
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
                "Error while generating report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while generating report"
        });
      }
    }
  );

  //api to get p2p reports
  app.post(
    "/api/p2p-reports/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
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
          .get(
            `${URLS.GET_P2P_REPORTS}/${Number(data?.page)}/${Number(
              data?.limit
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while getting borrower reports data."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while getting borrower reports"
        });
      }
    }
  );

  //api to download p2p report
  app.get(
    "/api/p2p-download-report/:id/:userId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: "",
            user_id: req?.params?.user_id,
            product_id: "",
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_P2P_REPORTS}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: "blob"
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading borrower report."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading borrower report"
        });
      }
    }
  );

  // get report requests api
  app.post(
    "/api/report-request/:report_name/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData?.company_id,
            user_id: userData?.user_id,
            product_id: userData?.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.REPORT_REQUEST}/${data.report_name}/${Number(data.page)}/${Number(data.limit)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message: error?.response?.data?.message || "Error while getting report request data"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message: error?.response?.data?.message || "Exception while getting report request data"
        });
      }
    }
  );

  // generate report request api
  app.post(
    "/api/report-request",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const submitData = req.body.submitData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
          {
            company_id: userData?.company_id,
            user_id: userData?.user_id,
            product_id: userData?.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .post(
            `${URLS.REPORT_REQUEST}`,
            submitData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message: error?.response?.data?.message || "Error while generating report request"
            });
          });
      } catch (error) {
        return res.status(400).json({
          message: error?.response?.data?.message || "Exception while generating report request"
        });
      }
    }
  );

  // download report from report request api
  app.post(
    '/api/report-request/download/:id',
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        const data = req.body;
        const userData = req.body.userData;
        // generate token
        const token = helper.generateToken(
          {
            company_id: userData?.company_id,
            user_id: userData?.user_id,
            product_id: data.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(
            `${URLS.REPORT_REQUEST}/download/${Number(data.request_id)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message: error?.response?.data?.message || "Error while downloading report file"
            });
          });

      } catch (error) {
        return res.status(400).json({
          message: error?.resposne?.data?.message || "Exception while downloading report file"
        });
      }
    }
  );

};
