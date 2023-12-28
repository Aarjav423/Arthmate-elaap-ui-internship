const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");

module.exports = app => {
  app.use(bodyParser.json());

  app.get('/api/collection-bank-details', (req, res) => {
    axios
    .get(URLS.GET_COLLECTION_BANK_DETAILS)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      return res.status(400).json({
        message: error.response.data.message || "Error while getting collection bank accounts"
      });
    });
  });
};