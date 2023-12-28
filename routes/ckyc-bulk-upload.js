"use strict";
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const axios = require("axios");
const { check, validationResult } = require("express-validator");
module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/api/ckyc-file-dump",
    [
      check("file_type").notEmpty().withMessage("Please select file type"),
    ],
    [
      passport.authenticate("jwt", { session: false }),
    ],
    (req, res) => {
      const CkycData = req.body;
      //generate token
      const token = helper.generateToken(
        {
          user_id: req.body.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw { message: errors.errors[0]["msg"] };
      } else {
        axios
          .post(URLS.CKYC_UPLOAD_REQUEST, CkycData, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => {
            res.json(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while Uploading File",
            });
          });
      }
    }
  );

  //api to get the uploaded ckyc files
  app.get(
    "/api/ckyc-file-details",
    [passport.authenticate("jwt", { session: false })],
    (req, res, next) => {
      const token = helper.generateToken(
        {
          user_id: req.params.user_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios.get(URLS.GET_CKYC_UPLOADED_FILE,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting ckyc files",
          });
        });
    }
  );

  app.get(
    "/api/download-processed-ckyc-files/:id/:user_id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      try {
        //generate token
        const token = helper.generateToken(
          {
            company_id: '',
            user_id: req?.params?.user_id,
            product_id: '',
            type: "dash"
          },
          60 * 5 * 1
        );
        axios
          .get(`${URLS.DOWNLOAD_CKYC_UPLOADED_FILE}/${req?.params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: 'blob',
          })
          .then(response => {
            return res.send(response.data);
          })
          .catch(error => {
            return res.status(400).json({
              message:
                error?.response?.data?.message ||
                "Error while downloading downloading ckyc file ."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while downloading ckyc file "
        });
      }
    }
  );

}