"use strict";
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const helper = require("../utils/helper");
const auth = require("../services/auth/auth");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");


module.exports = (app) => {
  app.use(bodyParser.json());
  app.get(
    "/api/co-lender-profile",
    [passport.authenticate("jwt", { session: false })],
    (req, res, next) => {
      axios
        .get(URLS.GET_COLENDER_PROFILE)
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting user list",
          });
        });
    }
  );

  app.get(
    "/api/co-lenders-product/:id",

    (req, res, next) => {
      axios
        .get(`${URLS.GET_COLENDERS_PRODUCTS}/${req.params.id}`)
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while getting colenders product list",
          });
        });
    }
  );

  app.get("/api/co-lender-loan-search", (req, res, next) => {
    axios
      .get(`${URLS.GET_COLENDERS_LOANS}`, {
        params: {
          co_lender_id: req.query.co_lender_id,
          company_id: req.query.company_id,
          product_id: req.query.product_id,
          status: req.query.status,
          min_colend_loan_amount: req.query.min_colend_loan_amount,
          max_colend_loan_amount: req.query.max_colend_loan_amount,
          from_created_at: req.query.from_created_at,
          to_created_at: req.query.to_created_at ? req.query.to_created_at + " 23:59:59" : req.query.to_created_at,
          page_no: req.query.page_no,
          size: req.query.size
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response.data.message ||
            "Error while getting colenders loans",
        });
      });
  });

  app.post(
    "/api/co-lender-profile",
    [
      check("co_lender_id").notEmpty().withMessage("Please enter co_lender_id"),
      check("co_lender_name")
        .notEmpty()
        .withMessage("Please enter co_lender_name"),
      check("co_lending_share")
        .notEmpty()
        .withMessage("Please select co_lending_share"),
        check("co_lending_mode")
        .notEmpty()
        .withMessage("Please select co_lending_mode"),
      check("co_lender_shortcode")
        .notEmpty()
        .withMessage("Please enter co_lender_shortcode"),
      check("foreclosure_share")
        .notEmpty()
        .withMessage("Please enter foreclosure_share"),
      check("lpi_share")
        .notEmpty()
        .withMessage("Please enter lpi_share")
    ],
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const colenderData = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.errors[0]["msg"] });
      } else {
        axios
          .post(URLS.GET_COLENDER_PROFILE, colenderData, {})
          .then((response) => {
            res.json(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while creating co_lender",
            });
          });
      }
    }
  );

  app.get(
    "/api/co-lender-profile/:id",
    [passport.authenticate("jwt", { session: false })],
    (req, res, next) => {
      axios
        .get(`${URLS.GET_COLENDER_PROFILE}/${req.params.id}`)
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting user list",
          });
        });
    }
  );

  app.put(
    "/api/co-lender-status/:id",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const colenderData = req.body;
      axios
        .put(`${URLS.GET_COLENDER_PROFILE}/${req.params.id}`, colenderData, {})
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while updating user status ",
          });
        });
    }
  );

  app.put(
    "/api/co-lender-profile/:id",
    [
      check("co_lender_id").notEmpty().withMessage("Please enter co_lender_id"),
      check("co_lender_name")
        .notEmpty()
        .withMessage("Please enter co_lender_name"),
      check("co_lending_share")
        .notEmpty()
        .withMessage("Please select co_lending_share"),
      check("co_lending_mode")
      .notEmpty()
      .withMessage("Please select co_lending_mode"),
      check("co_lender_shortcode")
        .notEmpty()
        .withMessage("Please enter co_lender_shortcode"),
    ],
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const colenderData = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.errors[0]["msg"] });
      } else {
        axios
          .put(
            `${URLS.GET_COLENDER_PROFILE}/${req.params.id}`,
            colenderData,
            {}
          )
          .then((response) => {
            res.json(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while creating co_lender",
            });
          });
      }

    }
  );

  app.get(
    "/api/co-lender-profile-newcolenderid",
    [
      passport.authenticate("jwt", { session: false })
    ],
    (req, res, next) => {
      axios
        .get(URLS.GET_COLENDER_NEW_COLENDER_ID)
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response?.data?.message || "Error while getting user list",
          });
        });
    }
  );


  app.post(
    "/api/bank-file-details-dump",
    [
      check("co_lender_name").notEmpty().withMessage("Please enter colender name"),
      check("file_type")
        .notEmpty()
        .withMessage("Please select file type"),
    ],
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const UTRData = req.body;
      //generate token
      const token = helper.generateToken(
        {
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
        axios
          .post(URLS.UTR_UPLOAD_REQUEST, UTRData, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => {
            res.json(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while Uploading UTR",
            });
          });
      }
    }
  );

  app.get(
    "/api/bank-file-details/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res, next) => {
      const token = helper.generateToken(
        {
          user_id: req.params.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(URLS.GET_UTR_FILES,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting UTR files",
          });
        });
    }
  );

  app.get("/api/cbi-loan-search", (req, res, next) => {
    const token = helper.generateToken(
      {
        user_id: req.query.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.GET_CBI_LOANS}`, {
        params: {
          co_lender_id: req.query.co_lender_id,
          company_id: req.query.company_id,
          product_id: req.query.product_id,
          from_created_at: req.query.from_created_at,
          to_created_at: req.query.to_created_at ? req.query.to_created_at + " 23:59:59" : req.query.to_created_at,
          page_no: req.query.page_no,
          size: req.query.size,
          status: req.query.status,
          assignee:req.query.assignee
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response.data.message ||
            "Error while getting cbi loans",
        });
      });
  });

  app.get("/api/fetch-loan-details", (req, res, next) => {
    axios
      .get(`${URLS.GET_LOAN_DETAILS}`, {
        params: {
          loan_id: req.query.loan_id,
      },
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response.data.message ||
            "Error while getting  loan details",
        });
      });
  });


  app.get("/api/file-upload-approval-search", (req, res, next) => {
    axios
      .get(`${URLS.GET_BULK_APPOVAL_FILES}`, {
        params: {
          co_lender_shortcode: req.query.co_lender_shortcode,
          file_type: req.query.file_type,
          validation_status: req.query.validation_status,
          from_created_at: req.query.from_created_at,
          to_created_at: req.query.to_created_at ? req.query.to_created_at + " 23:59:59" : req.query.to_created_at
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response.data.message ||
            "Error while getting files",
        });
      });
  });

  app.get("/api/fetch-lead-details", (req, res, next) => {
    axios
      .get(`${URLS.GET_LEAD_DETAILS}`, {
        params: {
          loan_app_id: req.query.loan_app_id,
      },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response.data.message ||
            "Error while getting  lead details",
        });
      });
  });

  app.get("/api/fetch-ckyc-details", (req, res, next) => {
    axios
      .get(`${URLS.GET_CKYC_DETAILS}`, {
        params: {
          loan_app_id: req.query.loan_app_id,
      },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response.data.message ||
            "Error while getting  CKYC details",
        });
      });
  });
  app.post(
    "/api/file-upload-approval-submit",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const FILEData = req.body;
      // generate token
      const token = helper.generateToken(
        {
          user_id: req.body[0].user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
        axios
          .post(URLS.FILE_UPLOAD_APPROVAL, FILEData, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => {
            res.json(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while submitting",
            });
          });
      }
    }
  );

  app.get("/api/fetch-cbi-loan/", (req, res, next) => {
      axios
      .get(`${URLS.GET_CBI_DETAILS}`,{
        params: {
          loan_id: req.query.loan_id,
      },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.send({
          message:
            error.response?.data.message ||
            "Error while getting cbi loans",
        });
      });
    });

  app.post(
    "/api/co-lender-loan-decision",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const colenderData = req.body;
      axios
        .post(`${URLS.UPDATE_LOAN_STATUS}`, colenderData, {})
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while updating user status ",
          });
        });
    }
  );

  app.post(
    "/api/co-lender-repayment-list",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const payload = req.body;
      // generate token
      const token = helper.generateToken(
        {
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
      axios
        .post(`${URLS.GET_COLENDER_REPAYMENT_LIST}`, payload,  {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while fetching repayment records ",
          });
        });
      }
    }
  );

  app.post(
    "/api/co-lend-transaction/:summary_id",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      // generate token
      const token = helper.generateToken(
        {
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
      axios
        .get(`${URLS.GET_COLENDER_SUMMARY}/${req.params.summary_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while fetching summary records ",
          });
        });
      }
    }
  );

  app.patch(
    "/api/update-summary-stage",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const payload = req.body;
      // generate token
      const token = helper.generateToken(
        {
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
      axios
        .patch(`${URLS.UPDATE_SUMMARY_STAGE}`,payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while updating summary stage ",
          });
        });
      }
    }
  );

  app.patch(
    "/api/co-lend-repayment-utr",
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const payload = req.body;
      // generate token
      const token = helper.generateToken(
        {
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
      axios
        .patch(`${URLS.UPDATE_PAID_STAGE}`,payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while updating Paid stage ",
          });
        });
      }
    }
  );

  app.get(
    "/api/download-all-document/:loan_id/:user_id/:company_id/:product_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const {
        loan_id,
        user_id,
        company_id,
        product_id
      } = req.params;
      const token = helper.generateToken(
        {
          loan_id,
          user_id,
          company_id,
          product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.DOWNLOAD_ALL_DOCUMENT}/${loan_id}`, {
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
              "Error while downloading documents."
          });
        })
    }
  )
}