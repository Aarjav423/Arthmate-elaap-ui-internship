const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/api/get-bulk-upload-data",
    async (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
            user_id: data?.user_id,
            type: "dash"
        },
        60 * 5 * 1
      )
      axios.post(`${URLS.BULK_UPLOAD_DATA}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response?.data);
      })
      .catch(error => {
        return res.status(400).send(error?.response?.data || "Error while fetching details");
      });
    }
  )

  app.post(
    "/api/upload-bulk-file",
    async (req, res) => {
      const data = req.body;
      const token = helper.generateToken(
        {
            user_id: data?.user_id,
            type: "dash"
        },
        60 * 5 * 1
      )
      axios.post(`${URLS.UPLOAD_BULK_FILE}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response?.data);
      })
      .catch(error => {
        return res.status(400).send(error.response?.data || "Error while uploading file");
      });
    }
  )

  app.post(
    "/api/download-bulk-upload-file/:id",
    async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const token = helper.generateToken(
        {
            user_id: data?.user_id,
            type: "dash"
        },
        60 * 5 * 1
      )
      axios.get(`${URLS.DOWNLOAD_BULK_UPLOAD_FILE}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return res.status(200).send(response?.data);
      })
      .catch(error => {
        return res.status(400).send(error?.response?.data || "Error while downloading file");
      });
    }
  )
  }