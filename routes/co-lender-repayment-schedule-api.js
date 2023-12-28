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
      "/api/co-lender-repayment-schedule/:co_lend_loan_id/:co_lender_id",
      [passport.authenticate("jwt", { session: false })],
      (req, res, next) => {
        axios
          .get(`${URLS.GET_COLENDER_REPAYMENT_SCHEDULE}/${req.params.co_lend_loan_id}/${req.params.co_lender_id}`)
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message ||
                "Error while getting colenders repayment schedule list",
            });
          });
      }
    );

}