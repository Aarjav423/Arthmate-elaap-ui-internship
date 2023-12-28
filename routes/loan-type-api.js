"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");
module.exports = app => {
  app.use(bodyParser.json());

  /** Method to convert xlsx to json */
  app.post("/api/xlsx_to_json/:_id", (req, res) => {
    /** Method to parse xlsx to json  */
    helper.parseFileTojson(req, res, (err, template) => {
      return res.send({type: req.params._id, result: template});
    });
  });

  app.get("/api/get_company_loanschema/:_comp_code", (req, res) => {
    const company_code = req.params._comp_code;
    axios
      .get(URLS.LOAN_SCHEMA + `/${company_code}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while geting loan schemas"
        });
      });
  });

  app.get("/api/loan_template_names", (req, res) => {
    const data = req.body;
    axios
      .get(URLS.LOAN_TEMPLATE, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while posting form data"
        });
      });
  });

  app.post("/api/loan_template_names", (req, res) => {
    const data = req.body;
    axios
      .post(URLS.LOAN_TEMPLATE, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while adding loan template name"
        });
      });
  });

  app.post("/api/get_default_templates", (req, res) => {
    const id = req.body.id;
    /** Method to submit  */
    axios
      .get(`${URLS.DEFAULT_TEMPLATES}/${id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while getting templates"
        });
      });
  });

  app.get("/api/default_loan_type", (req, res) => {
    axios
      .get(URLS.LOAN_TYPE)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error?.response?.data?.message || "Error while getting loan types. "
        });
      });
  });

  app.post("/api/default_loan_type", (req, res) => {
    const data = req.body;
    axios
      .post(URLS.LOAN_TYPE, data)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while adding loan default type "
        });
      });
  });

  app.post("/api/add_loan_doc_template", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.LOANDOC_TEMPLATE, data, {
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
            "Error while adding loan document template."
        });
      });
  });

  app.put("/api/custom_loan_template", (req, res) => {
    const data = req.body;
    //generate token
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        loan_schema_id: data.loan_schema_id,
        user_id: data.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .put(`${URLS.UPDATE_CUSTOM_TEMPLATE}`, data, {
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
            "Error while updating loan schema template."
        });
      });
  });

  app.post("/api/get_schema_templates", (req, res) => {
    const data = req.body;
    axios
      .get(`${URLS.SCHEMA_TEMPLATES}/${data.loan_schema_id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting schema loan template."
        });
      });
  });
};
