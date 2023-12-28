const axios = require("axios");
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post("/api/nach-transaction-details", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        user_id: data.user_id,
        type: "dash-api",
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.GET_TRANSACTION_DETAIL}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error?.response?.data || "Error while fetching Details.");
      });
  });
};
