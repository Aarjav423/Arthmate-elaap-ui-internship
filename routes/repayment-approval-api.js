const axios = require("axios");
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");

/**
  * Exporting Repayment Records API
  * @param {*} app
  * @return {*} Pending Repayment Details
  * @throws {*} No pending Repayment Records/(NA)
  */

module.exports = app => {
  app.use(bodyParser.json());

  app.post(
    "/api/pending-repayment-records/:company_id/:product_id/:page/:limit",
    async (req, res) => {
      const body = {
        utr_number : req.body.utr_number==="" ? "-1" : req.body.utr_number,
        txn_amount : req.body.txn_amount==="" ? "-1": req.body.txn_amount,
        txn_reference : req.body.txn_reference==="" ? "-1" : req.body.txn_reference,
        status: req.body.status
      };
      const {
        company_id,
        product_id,
        page,
        limit
      } = req.params;
      const token = helper.generateToken(
        {
          company_id,
          product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios.get(
          `${URLS.GET_PENDING_REPAYMENT_LIST}/${company_id}/${product_id}/${body.txn_amount}/${body.txn_reference}/${body.utr_number}/${body?.status}/${page}/${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(response => {
          res.send(response.data);
        }).catch(error => {
          return res.status(400).json({message: error.response?.data?.message});
        });
      }
  );
  
  //Approve Repayments
  app.post("/api/repayment-approve", async (req, res) => {
    const {company_id, product_id, user_id, status, bankName, bankAccountNumber} = req.body.data;
    const token = helper.generateToken(
      {
        company_id,
        product_id,
        user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios.put(
        `${URLS.APPROVE_REPAYMENTS}/${status}/${bankName}/${bankAccountNumber}`,
        req.body.selectedRecords,
        {
          headers: {Authorization: `Bearer ${token}`}
        }).then(response => {
          res.send(response.data);
        }).catch(error => {
          return res.status(400).json({message: error.response?.data?.message});
        });
    });
  };
