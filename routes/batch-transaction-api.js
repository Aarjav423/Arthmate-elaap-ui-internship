const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/api/batch-transaction-data",
    async (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
            user_id: data.user_id,
            company_id: data?.company_id,
            type: "dash"
        },
        60 * 5 * 1
      )
      axios.post(`${URLS.BATCH_TRANSACTION_DATA}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response.data);
      })
      .catch(error => {
        return res.status(400).send(error.response.data || "Error while fetching datch transaction data");
      });
    }
  )

  app.post(
    "/api/upload-presentment-file",
    async (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
            user_id: data.user_id,
            company_id: data?.company_id,
            type: "dash"
        },
        60 * 5 * 1
      )
      axios.post(`${URLS.UPLOAD_PRESENTMENT_FILE}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response.data);
      })
      .catch(error => {
        return res.status(400).send(error.response.data || "Error while uploading presentment file");
      });
    }
  )

  app.post(
    "/api/download-presentment-file/:id",
    async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const token = helper.generateToken(
        {
            user_id: data.user_id,
            company_id: data?.company_id,
            type: "dash"
        },
        60 * 5 * 1
      )
      axios.get(`${URLS.DOWNLOAD_PRESENTMENT_FILE}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response.data);
      })
      .catch(error => {
        return res.status(400).send(error.response.data || "Error while downloading presentment file");
      });
    }
  )
}