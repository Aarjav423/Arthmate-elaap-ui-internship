"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = app => {
  app.use(bodyParser.json());

  app.get(
    "/api/loanrequest/:company_id/:product_id/:from_date/:to_date/:page/:limit/:str/:status/:user_id",
    (req, res) => {
      const query =req.query;
      const token = helper.generateToken(
        {
          company_id: req.params.company_id,
          product_id: req.params.product_id,
          user_id: req.params.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .get(
          `${URLS.LOAN_REQUEST}/${req.params.company_id}/${req.params.product_id}/${req.params.from_date}/${req.params.to_date}/${req.params.page}/${req.params.limit}/${req.params.str}/${req.params.status}`,
          {
            params:query,
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res
            .status(400)
            .send(error.response.data || "Error while fetching leads");
        });
    }
  );

  app.post("/api/loanrequest/:loan_id", (req, res) => {
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(
        `${URLS.LOAN_REQUEST}/${req.body.company_id}/${req.body.product_id}/${
          req.body.from_date
        }/${req.body.to_date}/${req.params.page}/${req.params.limit}/${
          req.body.loan_id
        }/${null}`,
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
        return res
          .status(400)
          .send(error.response.data || "Error fetching leads by loan id");
      });
  });

  /** Method to handle the form submit */
  app.post(
    "/api/loan_request_form/:_company_id/:__company_code/:_product_id/:loan_schema_id/:_user_id",
    [
      passport.authenticate("jwt", {
        session: false
      })
    ],
    (req, res) => {
      const postData = req.body;
      //generate token
      const token = helper.generateToken(
        {
          company_id: req.params._company_id,
          company_code: req.params._company_code,
          loan_schema_id: req.params.loan_schema_id,
          product_id: req.params._product_id,
          user_id: req.params._user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.LOAN_REQUEST, [postData], {
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
            .send(error.response.data || "Error adding loan request data");
        });
    }
  );

  app.post("/api/lead/activity-log/:loan_app_id", (req, res) => {
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.LOAN_REQUEST}/activity-log/${req.params?.loan_app_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.send(response.data);
      })
      .catch(error => {
        return res
          .status(400)
          .send(error.response.data || "Error fetching leads by loan id");
      });
  });

  app.get(
    "/api/lead/details/:loan_app_id/:company_id/:product_id/:user_id/:loan_schema_id",
    (req, res) => {
      const { company_id, product_id, loan_app_id, user_id, loan_schema_id } =
        req.params;
      const token = helper.generateToken(
        {
          company_id,
          product_id,
          loan_schema_id,
          user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      /** Method to get  */
      axios
        .get(`${URLS.LOAN_REQUEST}/details/${loan_app_id}`, {
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
              error.response.data.message || "Error while fetching lead details"
          });
        });
    }
  );

  app.get(
    "/api/lead-cibil-report/:loan_app_id/:company_id/:product_id/:user_id/:borrower_type",
    (req, res) => {
      const { company_id, product_id, loan_app_id, user_id, borrower_type } =
        req.params;
      const token = helper.generateToken(
        {
          company_id,
          product_id,
          user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      /** Method to get  */
      axios
        .get(`${URLS.CIBILREPORTDOWNLOAD}/${loan_app_id}/${borrower_type}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(async response => {
          res.send(response.data);
        })
        .catch(error => {
          return res.status(400).json({
            message:
              error.response.data.message || "Error while fetching lead details"
          });
        });
    }
  );

  app.post("/api/lead/:loan_app_id", (req, res) => {
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.LOAN_REQUEST}/${req.params.loan_app_id}`, {
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
          .send(error.response.data || "Error while fetching leads");
      });
  });

  app.post("/api/lead-export", (req, res) => {
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );

    axios
      .post(`${URLS.LOAN_REQUEST_EXPORT}`, req.body, {
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
          .send(error.response.data || "Error while fetching leads");
      });
  });

  app.put("/api/lead", (req, res) => {
    const postData = req.body.postData;
    const { company_id, product_id, loan_schema_id, user_id } =
      req.body.options;
    const token = helper.generateToken(
      {
        company_id,
        product_id,
        loan_schema_id,
        user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .put(`${URLS.LOAN_REQUEST}`, [postData], {
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
          .send(error.response.data || "Error while updating leads");
      });
  });

  app.put("/api/lead-soft-delete/:loan_app_id", (req, res) => {
    const { company_id, product_id, loan_schema_id, user_id } = req.body;
    const token = helper.generateToken(
      { company_id, product_id, loan_schema_id, user_id, type: "dash-api" },
      60 * 5 * 1
    );
    axios
      .put(
        `${URLS.DELETE_LEAD}/${req.params.loan_app_id}`,
        {},
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
        return res
          .status(400)
          .send(error.response.data || "Error while delete lead");
      });
  });

  app.put("/api/lead-status-decission", (req, res) => {
    const payload = req.body;
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .put(`${URLS.LEAD_MANUAL_REVIEW}`, payload, {
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
          .send(error.response.data || "Error while manual review request");
      });
  });

  app.post("/api/settlement-request/:loan_id", (req, res) => {
    const payload = req.body;
    const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
    axios
      .post(
        `${URLS.SETTLEMENT_REQUEST_TRANCHES}/${req.params.loan_id}`,payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response.data || "Error while submitting request");
      });
  });

  app.patch("/api/settlement-request/:loan_id/:request_id", (req, res) => {
    const payload = req.body;
    const token = helper.generateToken(
        {
          company_id: req.body.company_id,
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
    axios
      .patch(
        `${URLS.SETTLEMENT_DECISION}/${req.params.loan_id}/${req.params.request_id}`,payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response.data || "Error while submitting request");
      });
  });

  //api to leads document data by load id
  app.get(
    "/api/kyc-document-data/:company_id/:product_id/:user_id/:loan_id",
    (req, res) => {
      const token = helper.generateToken(
        {
          company_id: req.params.company_id,
          product_id: req.params.product_id,
          user_id: req.params.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_LEAD_DEATILS_BY_LOAN_ID}/${req.params.loan_id}`, {
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
            .send(error.response.data || "Error while fetching leads");
        });
    }
  );

  app.put(
    "/api/kyc-document-data/:company_id/:product_id/:user_id/:loan_id",
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          company_id: req.params.company_id,
          product_id: req.params.product_id,
          user_id: req.params.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .put(
          `${URLS.GET_LEAD_DEATILS_BY_LOAN_ID}/${req.params.loan_id}`,
          payload,
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
          return res
            .status(400)
            .send(error.response.data || "Error while fetching leads");
        });
    }
  );
};
