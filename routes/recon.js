"use strict";
const axios = require("axios");
const bodyParser = require("body-parser");
const URLS = require("../constants/apiUrls");
const helper = require("../utils/helper");

module.exports = (app) => {
  app.use(bodyParser.json());
  
  app.post("/api/recon-details/:user_id/:loan_id",(req,res)=>{
    try{
      
      const body = req.body;
      const token = helper.generateToken(
        {
          company_id: body.company_id,
          user_id: req?.params?.user_id,
          product_id: body.product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios.get(`${URLS.GET_RECON_DETAILS}/${req.params.loan_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }).then(response=>{
          return res.send(response.data);
        }).catch(error=>{
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while getting recon details."
        });
      })
    }catch (error){
      return res.status(400).json({
        message:
          error.response.data.message ||
          "Error while getting recon details"
      });
    }
  })
}
