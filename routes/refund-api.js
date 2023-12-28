const passport = require('passport');
const helper = require('../utils/helper');
const axios = require('axios');
const URLS = require('../constants/apiUrls');
const bodyParser = require('body-parser');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post('/api/refund-details/:loan_id', [passport.authenticate('jwt', { session: false })], (req, res) => {
    try {
      const loan_id = req.params.loan_id;
      const data = req.body;
      //generate token
      const token = helper.generateToken(
        {
          company_id: data?.company_id,
          user_id: data?.user_id,
          product_id: data?.product_id,
          type: 'dash',
        },
        60 * 5 * 1,
      );
      axios
        .get(`${URLS.GET_REFUND_DETAILS}/${loan_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message || 'Error while getting refund data.',
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: error.response.data.message || 'Error while getting refund data',
      });
    }
  });

  app.post('/api/initiate-interest-refund', [passport.authenticate('jwt', { session: false })], (req, res) => {
    try {
      const data = req.body;
      //generate token
      const token = helper.generateToken(
        {
          company_id: data?.company_id,
          user_id: data?.user_id,
          product_id: data?.product_id,
          type: 'dash',
        },
        60 * 5 * 1,
      );
      axios
        .post(
          `${URLS.INITIATE_REFUND}`,
          { ...data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          return res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message || 'Error while initiating refund.',
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: error.response.data.message || 'Error while initiating refund.',
      });
    }
  });

  app.post('/api/initiate-excess-refund', [passport.authenticate('jwt', { session: false })], (req, res) => {
    try {
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: data?.company_id,
          user_id: data?.user_id,
          product_id: data?.product_id,
          type: 'dash',
        },
        60 * 5 * 1,
      );
      axios
        .post(
          `${URLS.INITIATE_EXCESS_REFUND}`,
          { ...data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          return res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.response.data.message || 'Error while initiating refund.',
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: error.response.data.message || 'Error while initiating refund.',
      });
    }
  });
};
