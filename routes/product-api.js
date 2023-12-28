"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post("/api/product", (req, res) => {
    const data = req.body;
    const token = helper.generateToken({
      company_id: data.company_id,
      company_code: data.company_code,
      loan_schema_id: data.loan_schema_id,
      product_id: null,
      user_id: data.user_id,
      type: 'dash'
     }, 60 * 5 * 1);
    axios
      .post(URLS.PRODUCT, data,{
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

  app.get("/api/product/:id", (req, res) => {
    axios
      .get(`${URLS.PRODUCT}/${req.params.id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting product",
        });
      });
  });

   app.get("/api/loan-document-mapping", (req, res) => {
    axios
      .get(`${URLS.DOCS_MAPPING}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Error while getting product",
        });
      });
  });

  app.get("/api/get_products_by_company_id/:_id", (req, res) => {
    const data = req.body;
    axios
      .get(`${URLS.PRODUCT_BY_COMPANY}/${req.params._id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while getting products",
        });
      });
  });

  app.get("/api/get_products_by_loc_company_id/:_id", (req, res) => {
    const data = req.body;
    axios
      .get(`${URLS.PRODUCT_BY_LOC_COMPANY}/${req.params._id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while getting products",
        });
      });
  });

  app.post("/api/product/status", (req, res) => {
      const data = req.body.statusData;
      const tokenData = req.body.tokenData;
      const token = helper.generateToken(
        {
          company_id: tokenData.company_id,
          product_id: data.id,
          loan_schema_id: tokenData.loan_schema_id * 1,
          company_code: data.company_code,
          user_id: tokenData.user_id,
          type: "dash",
        },
        60 * 5 * 1
      );
    axios
      .put(`${URLS.PRODUCT}/${"status"}`, data,{

        headers: {
            'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while getting products",
        });
      });
  });

  app.get("/api/products/:company_id", (req, res) => {
    /** Method to submit */
    axios
    .get(`${URLS.PRODUCT_BY_COMPANY}/${req.params.company_id}`)
    .then((response) => {
    res.send(response.data);
    })
    .catch((error) => {
    return res.status(400).json({
    message: error.response.data.message || "Error while getting product",
    });
    });
    });


    app.post("/api/product/:company_id/:loan_schema_id/:product_id", (req, res) => {
      const {product_id, ...data} = req.body;

      const token = helper.generateToken({
        company_id: data.company_id,
        company_code: data.company_code,
        loan_schema_id: data.loan_schema_id,
        product_id: product_id,
        user_id: data.user_id,
        type: 'dash'
       }, 60 * 5 * 1);

      axios
        .post(`${URLS.PRODUCT}/${data.company_id}/${data.loan_schema_id}/${product_id}`, data,{
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
}
