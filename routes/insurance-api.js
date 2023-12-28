("use strict");
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/calculate-insurance-premium", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        user_id: data.user_id,
        company_id: data.company_id,
        product_id: data.product_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(URLS.CALCULATE_INSURANCE_PREMIUM, data, {
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
            "Error while calculating insurance premium."
        });
      });
  });
};
