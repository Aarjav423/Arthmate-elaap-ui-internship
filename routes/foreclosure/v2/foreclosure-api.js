'use strict';
const bodyParser = require('body-parser');
const passport = require('passport');
const axios = require('axios');
const URLS = require('../../../constants/apiUrls');
const helper = require('../../../utils/helper');

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get('/api/v2/foreclosure-request/:loan_id/:company_id/:product_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { loan_id, company_id, product_id } = req.params;

    const token = helper.generateToken(
      {
        company_id: company_id,
        product_id: product_id,
        user_id: req.user._id,
        type: 'dash-api',
      },
      60 * 5 * 1,
    );

    axios
      .get(`${URLS.FORECLOSURE_URL}/${loan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        return res.status(404).send({
          message: error.response.data.message || 'Something went wrong',
        });
      });
  });

  app.post('/api/v2/foreclosure-request/:loan_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const filter = req.body;
    const token = helper.generateToken(
      {
        company_id: filter.companyData.company_id,
        product_id: filter.companyData.product_id,
        user_id: req.user._id,
        type: 'dash',
      },
      60 * 5 * 1,
    );
    axios
      .post(`${URLS.FORECLOSURE_URL}/${filter.companyData.loan_id}`, filter, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || 'Error while fetching foreclosure data.',
        });
      });
  });

  app.get('/api/v2/foreclosure-offer-request/:loan_id/:company_id/:product_id/:request_id/:user_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { company_id, product_id, request_id, loan_id, user_id } = req.params;
    const token = helper.generateToken(
      {
        company_id: company_id,
        product_id: product_id,
        user_id: user_id,
        type: 'dash',
      },
      60 * 5 * 1,
    );
    axios
      .get(`${URLS.FORECLOSURE_REQUEST_DETAILS_BY_REQ_ID}/${loan_id}/${request_id}/${company_id}/${product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error?.response?.data?.message || 'Error while getting foreclosure request details 1.',
        });
      });
  });

  app.post('/api/v2/foreclosure-request/conclusion/:loan_id/:company_id/:product_id/:approver_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { company_id, product_id, loan_id, approver_id } = req.params;
    const token = helper.generateToken(
      {
        company_id: company_id,
        product_id: product_id,
        user_id: approver_id,
        type: 'dash-api',
      },
      60 * 5 * 1,
    );

    const payload = {
      approver_id: req.body.approver_id,
      approver_comment: req.body.approver_comment,
      status: req.body.status,
    };
    axios
      .post(`${URLS.UPDATE_FORECLOSURE_REQUEST_STATUS}/${loan_id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error?.response?.data?.message || 'Error while getting foreclosure request details 2.',
        });
      });
  });

  app.get('/api/v2/foreclosure-offers-requests/:loan_id/:company_id/:product_id/:user_id/:page/:limit', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { company_id, product_id, loan_id, user_id, page, limit } = req.params;
    const token = helper.generateToken(
      {
        company_id: company_id,
        product_id: product_id,
        user_id: user_id,
        type: 'dash',
      },
      60 * 5 * 1,
    );
    axios
      .get(`${URLS.FORECLOSURE_OFFERS_REQUESTS}/${loan_id}/${page}/${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error?.response?.data?.message || 'Error while getting foreclosure request details 3.',
        });
      });
  });

  app.get('/api/v2/force-close/:company_id/:product_id/:loan_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { loan_id, company_id, product_id } = req.params;
    const token = helper.generateToken(
      {
        company_id: company_id,
        product_id: product_id,
        user_id: req.user._id,
        type: 'dash-api',
      },
      60 * 5 * 1,
    );
    axios
      .get(`${URLS.FORCE_CLOSE_URL}/${loan_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        return res.status(404).send({
          message: error.response.data.message ?? 'Something went wrong, please try again.',
        });
      });
  });

  app.post('/api/v2/force-close/:company_id/:product_id/:loan_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { loan_id, company_id, product_id } = req.params;
    const token = helper.generateToken(
      {
        company_id: company_id,
        product_id: product_id,
        user_id: req.user._id,
        type: 'dash',
      },
      60 * 5 * 1,
    );
    axios
      .post(`${URLS.FORCE_CLOSE_URL}/${loan_id}`, req.body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message ?? 'Something went wrong, please try again.',
        });
      });
  });
};
