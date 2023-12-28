'use strict';
const axios = require('axios');
const helper = require('../utils/helper');
const passport = require('passport');
const URLS = require('../constants/apiUrls');
const bodyParser = require('body-parser');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get('/api/refund/:type/:user_id/:page/:limit/:company_id?/:product_id?/:financial_quarter?/:status?/:tds_id?/:disbursement_date_time?/:loan_app_date?/:loan_id?', [passport.authenticate('jwt', { session: false })], (req, res) => {
    const { type, user_id, page, limit, company_id, product_id, financial_quarter, status, tds_id, disbursement_date_time, loan_app_date, loan_id } = req.params;

    const queryParams = [];

    if (company_id !== undefined && !isNaN(company_id)) {
      queryParams.push(`company_id=${company_id}`);
    }
    if (product_id !== undefined && !isNaN(product_id)) {
      queryParams.push(`product_id=${product_id}`);
    }

    if (financial_quarter !== undefined && typeof financial_quarter === 'string') {
      queryParams.push(`financial_quarter=${financial_quarter}`);
    }

    if (status !== undefined && typeof status === 'string') {
      queryParams.push(`status=${status}`);
    }

    if (tds_id !== undefined && !isNaN(tds_id)) {
      queryParams.push(`tds_id=${tds_id}`);
    }

    if (disbursement_date_time !== undefined && typeof status === 'string'){
      queryParams.push(`disbursement_date_time=${disbursement_date_time}`);
    }

    if (loan_app_date !== undefined && typeof status === 'string'){
      queryParams.push(`loan_app_date=${loan_app_date}`);
    }

    if (loan_id !== undefined && typeof status === 'string'){
      queryParams.push(`loan_id=${loan_id}`);
    }

    const token = helper.generateToken(
      {
        user_id: user_id,
        type: 'dash',
      },
      60 * 5 * 1,
    );
    const apiUrl = `${URLS.GET_TDS_REFUND_DATA}?type=${type}&page=${page}&limit=${limit}${queryParams.length > 0 ? `&${queryParams.join('&')}` : ''}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message,
        });
      })
    }
  );
  app.patch("/api/update-tds-refund",
    (req, res) => {
      try {
        const data = req.body;
        const token = helper.generateToken(
          {
            company_id: data?.company_id,
            user_id: data?.user_id,
            product_id: data?.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios.patch(`${URLS.UPDATE_TDS_REFUND}`,{...data},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          .then(response => {
            return res.send(response.data);
          }).catch(error => {
            return res.status(400)
              .json({
                message:
                  error.response.data.message ||
                  "Error while updating TDS Refund Status"
              });
          });
      } catch (error) {
        return res.status(400)
          .json({
            message:
              error.response.data.message ||
              "Error while updating TDS Refund Status"
          });
      }
    }
  );

  app.get(
    "/api/v2/refund-details/:company_id/:product_id/:loan_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const { loan_id, company_id, product_id } = req.params;

      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: req.user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .get(`${URLS.GET_REFUND_LOANID_DETAILS}/${loan_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message: error.response.data.message || "Something went wrong",
          });
        });
    }
  );
};
