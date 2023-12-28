const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");
const axios = require("axios");
const passport = require("passport");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/force-cancel/:company_id/:product_id/:loan_id",
    [passport.authenticate("jwt", {session: false})],
    async (req, res) => {
      const { loan_id, company_id, product_id } = req.params;
      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: req?.user?._id,
          type: "dash"
        },
        60 * 5 * 1
      )
      axios.get(`${URLS.FORCE_CANCEL_URL}/${loan_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response?.data);
      })
      .catch(error => {
        return res.status(400).send(error?.response?.data || "Something went wrong, please try again.");
      });
    }
  )

  app.post(
    "/api/force-cancel/:company_id/:product_id/:loan_id",
    [passport.authenticate("jwt", {session: false})],
    async (req, res) => {
      const { loan_id, company_id, product_id } = req.params;
      const data = req.body;
      const token = helper.generateToken(
        {
          company_id: company_id,
          product_id: product_id,
          user_id: req?.user?._id,
          type: "dash"
        },
        60 * 5 * 1
      )
      axios.post(`${URLS.FORCE_CANCEL_URL}/${loan_id}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response?.data);
      })
      .catch(error => {
        return res.status(400).send(error.response?.data || "Something went wrong, please try again.");
      });
    }
  )
}