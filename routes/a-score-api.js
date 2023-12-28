const helper = require("../utils/helper");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");
module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/aScore-data/", (req, res) => {
    const { submitData, userData } = req.body;
    const token = helper.generateToken(
      {
        company_id: userData.company_id,
        product_id: userData.product_id,
        user_id: userData.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.UPDATE_A_SCORE_DATA}`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error.response.data.message || "AScore details not found."
        });
      });
  });

  app.post("/api/aScore-data/:loan_app_id", (req, res) => {
    const { loan_app_id } = req.params;
    const userData = req.body;
    const token = helper.generateToken(
      {
        company_id: userData.company_id,
        product_id: userData.product_id,
        user_id: userData.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.GET_A_SCORE_DATA}/${loan_app_id}`, {
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
            "A Score details not found against loan_app_id."
        });
      });
  });
};
