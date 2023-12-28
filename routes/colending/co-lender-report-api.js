"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const helper = require("../../utils/helper");

module.exports = app => {
    app.use(bodyParser.json());
    app.post(
        "/api/co-lender-repayment-report",
        [passport.authenticate("jwt", { session: false })],
        (req, res) => {
            const payload = req.body;
            //generate token
            const token = helper.generateToken(
                {
                    user_id: payload.user_id,
                    type: "dash"
                },
                60 * 5 * 1
            );
            axios
                .post(`${URLS.GET_CO_LENDER_REPAYMENT_REPORTS}`,payload,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    return res.send(response.data);
                })
                .catch(error => {
                    return res.status(400).json({
                        message:
                            error?.response?.data?.message ||
                            "Error in finding co-lender repayment data."
                    });
                });
        }
    );

    app.post(
        "/api/download-co-lender-repayment-summary",
        [passport.authenticate("jwt", { session: false })],
        (req, res) => {
            const payload = req.body;
            //generate token
            const token = helper.generateToken(
                {
                    user_id: payload.user_id,
                    type: "dash"
                },
                60 * 5 * 1
            );
            axios
                .post(`${URLS.DOWNLOAD_CO_LENDER_REPAYMENT_SUMMARY}`,payload,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType:"arraybuffer"
                })
                .then(response => {
                    return res.send(response.data);
                })
                .catch(error => {
                    return res.status(400).json({
                        message:
                            error?.response?.data?.message ||
                            "Error in finding co-lender repayment data."
                    });
                });
        }
    );
}