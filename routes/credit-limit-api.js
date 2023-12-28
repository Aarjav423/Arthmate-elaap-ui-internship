const axios = require("axios");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.post("/api/credit-limit", (req, res) => {
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
    axios
      .post(URLS.SET_CREDIT_LIMIT, [data], {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Failed to set credit limit"
        });
      });
  });

  app.put("/api/credit-limit", (req, res) => {
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
    axios
      .put(URLS.SET_CREDIT_LIMIT, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || "Failed to set credit limit"
        });
      });
  });
};
