"use strict";
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = (app) => {
    app.use(bodyParser.json());
    app.get("/api/get-state-city", (req, res, next) => {
        try {
            axios.get(URLS.STATE_CITY_URL).then((response) => {
                return res.json(response.data);
            }).catch((error) => {
                return res.status(404).send({
                    message: error.response.data.message || "Something went wrong",
                });
            });
        } catch (error) {
            return res.status(404).send({
                message: error.response.data.message || "Something went wrong",
            });
        };
    });
};