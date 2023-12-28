const helper = require("../utils/helper");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");
module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/offer-details-data/:loan_app_id", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: data.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );

    axios
      .get(`${URLS.OFFER_DETAILS}/${req.params.loan_app_id}`, {
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
            "Error while submitting offer details."
        });
      });
  });
};
