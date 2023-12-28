"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
    app.post(
        "/api/repayment-file",
        [passport.authenticate("jwt", {session: false})],
        (req,res) => {
            try {
                const data = req.body;
                const token = helper.generateToken(
                    {
                        user_id: data.user_id,
                        type: "dash"
                    },
                    60 * 5 * 1
                )
                axios.post(`${URLS.OPERATION_BULK_UPLOAD}`,data,
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
                .then(response => {
                    return res.status(200).send(response.data);
                  })
                  .catch(error => {
                    return res.status(400).json({
                      message:
                        error.response.data.message ||
                        "Error while posting scheme details"
                    });
                  });
            } catch(error) {
                return res.status(400).send(error)
            }
        }
    )

    app.post(
        "/api/repayment-file/:page/:limit",
        [passport.authenticate("jwt", {session: false})],
        (req,res) => {
            try {
                const { page, limit } = req.params
                const { sort , stage, file, from, to, user_id, record_stage } = req.body;
                const token = helper.generateToken(
                    {
                        user_id: user_id,
                        type: "dash"
                    },
                    60 * 5 * 1
                )
                let query = `?sort=${sort}`
                if (typeof stage !== 'undefined') {
                    query = `${query}&stage=${stage}`
                }
                if (typeof file !== 'undefined') {
                    query = `${query}&file=${file}`
                }
                if (typeof record_stage !== 'undefined') {
                  query = `${query}&record_stage=${record_stage}`
                }
                if (from && to) {
                    query = `${query}&from=${from}&to=${to}`
                }
                axios.get(`${URLS.OPERATION_BULK_UPLOAD}/${page}/${limit}${query}`,
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
                .then(response => {
                    return res.status(200).send(response.data);
                  })
                  .catch(error => {
                    return res.status(400).json({
                      message:
                        error.response.data.message ||
                        "Error while fetching repayment file details"
                    });
                  });
            } catch(error) {
                return res.status(400).send(error)
            }
        }
    )

    app.post(
        "/api/repayment-file/:id",
        [passport.authenticate("jwt", {session: false})],
        (req,res) => {
            try {
                const { user_id, s3_url, id } = req.body;
                const token = helper.generateToken(
                    {
                        user_id: user_id,
                        type: "dash"
                    },
                    60 * 5 * 1
                )
                const request = {
                    s3_url
                }
                axios.post(`${URLS.OPERATION_BULK_UPLOAD}/${id}`,request,
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    },
                    responseType:"arraybuffer"
                  }
                )
                .then(response => {
                    return res.status(200).send(response.data);
                  })
                  .catch(error => {
                    return res.status(400).json({
                      message:
                        error.response.data.message ||
                        "Error while downloading repayment file details"
                    });
                  });
            } catch(error) {
                return res.status(400).send(error)
            }
        }
    )
}