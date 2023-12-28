"use strict";
const bodyParser = require("body-parser");
const passport = require("passport");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get(
    "/api/product-scheme/scheme/:product_id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { product_id, user_id } = req.params;
      const token = helper.generateToken(
        {
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_ALL_PRODUCT_SCHEME}/${product_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error?.response?.data?.message
          });
        });
    }
  );

  app.put(
    "/api/product-scheme/:product_id/:id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { id, user_id, product_id } = req.params;
      const token = helper.generateToken(
        {
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .put(`${URLS.UPDATE_TOGGLE_PRODUCT_SCHEME_STATUS}/${id}`, req.body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message: error.response?.data?.message
          });
        });
    }
  );
  app.get(
    "/api/product-scheme/products/all",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { user_id } = req.params;
      const token = helper.generateToken(
        {
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_ALL_PRODUCT_REQUEST}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.get(
    "/api/product-scheme/active",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { user_id } = req.params;
      const token = helper.generateToken(
        {
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_ALL_ACTIVE_PRODUCTS}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.get(
    "/api/product-scheme/:product_id/:scheme_id/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { product_id, scheme_id, user_id, page, limit } = req.params;
      const token = helper.generateToken(
        {
          scheme_id: scheme_id,
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const queryParams = {
        product_id: product_id,
        scheme_id: scheme_id
      };
      axios
        .get(`${URLS.GET_ALL_PRODUCT_SCHEME_MAPPING}/${page}/${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: queryParams
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.get(
    "/api/product-scheme/:product_id/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { product_id, scheme_id, user_id, page, limit } = req.params;
      const token = helper.generateToken(
        {
          scheme_id: scheme_id,
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const queryParams = {
        product_id: product_id,
        scheme_id: scheme_id
      };
      axios
        .get(`${URLS.GET_ALL_PRODUCT_SCHEME_MAPPING}/${page}/${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: queryParams
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.get(
    "/api/product-scheme/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { product_id, scheme_id, user_id, page, limit } = req.params;
      const token = helper.generateToken(
        {
          scheme_id: scheme_id,
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const queryParams = {
        product_id: product_id,
        scheme_id: scheme_id
      };
      axios
        .get(`${URLS.GET_ALL_PRODUCT_SCHEME_MAPPING}/${page}/${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: queryParams
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.get(
    "/api/scheme/:page/:limit",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { user_id, page, limit } = req.params;
      const token = helper.generateToken(
        {
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_ALL_SCHEMES_LIST}/${page}/${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message
          });
        });
    }
  );

  app.post(
    "/api/product-scheme/:product_id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { product_id, user_id } = req.params;
      let { scheme_id } = req.body;
      const token = helper.generateToken(
        {
          product_id: product_id,
          user_id: user_id,
          type: "dash"
        },
        60 * 5 * 1
      );

      axios
        .post(
          `${URLS.PRODUCT_SCHEME_MAPPED}`,
          {
            product_id: product_id,
            scheme_id: scheme_id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message: error.response.data.message
          });
        });
    }
  );
};
