"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = app => {
    app.use(bodyParser.json());

    app.post("/api/collateral/list", (req, res) => {
        const data = req.body.sendData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
            {
                company_id: userData?.company_id,
                user_id: userData?.user_id,
                product_id: data?.product_id,
                type: "dash"
            },
            60 * 5 * 1
        );
        axios.post(URLS.GET_COLLATERAL_LIST, data, {
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
                        error.response.data.message ||
                        "Error while geting collateral list"
                });
            });
    });

    app.post("/api/collateral_record/:id", (req, res) => {
        const data = req.body.sendData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
            {
                company_id: userData?.company_id,
                user_id: userData?.user_id,
                product_id: data?.product_id,
                type: "dash"
            },
            60 * 5 * 1
        );
        axios
            .get(`${URLS.GET_COLLATERAL_RECORD}/${data.id}`, {
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
                        error.response.data.message || "Error while getting collateral details."
                });
            });
    });

    app.put("/api/collateral_details/:id", (req, res) => {
        const data = req.body.sendData;
        const userData = req.body.userData;
        //generate token
        const token = helper.generateToken(
            {
                company_id: userData?.company_id,
                user_id: userData?.user_id,
                product_id: userData?.product_id,
                type: "dash"
            },
            60 * 5 * 1
        );
        axios
            .put(`${URLS.UPDATE_COLLATERAL_RECORD}/${data.id}`, data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then(response => {
                return res.send(response.data);
            })
            .catch(error => {
                return res.status(400).json({
                    message:
                        error.response.data.message ||
                        "Error while updating collateral details"
                });
            });
    });
  
    app.post("/api/collateral_details", (req, res) => {
    const data = req.body.submitData;
    const userData = req.body.userData;
    //generate token
    const token = helper.generateToken(
      {
        company_id: userData?.company_id,
        user_id: userData?.user_id,
        product_id: userData?.product_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios.post(`${URLS.ADD_COLLATERAL_RECORD}`,data, {
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
            error.response.data.message || "Error while adding collateral details."
        });
      });
  });
};
