const bodyParser = require("body-parser");
const passport = require("passport");
const helper = require("../utils/helper");
const axios = require("axios");
const URLS = require("../constants/apiUrls");

module.exports = app => {
  app.use(bodyParser.json());
  
  app.post(
    "/api/status-logs/:page/:loan_id",
    [passport.authenticate("jwt", {session: false})],
    (req, res) => {
      try {
        const { loan_id, page } = req.params;
        const data = req.body;
        
        //generate token
        const token = helper.generateToken(
          {
            company_id: data?.company_id,
            user_id: data?.user_id,
            product_id: data?.product_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios.get(`${URLS.STATUS_LOGS}/${page}/${loan_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          ).then(response => {
            return res.send(response.data);
          }).catch(error => {
            return res.status(400).json({
              message:
                error.response.data.message ||
                "Error while getting status logs."
            });
          });
      } catch (error) {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting status logs."
        });
      }
    }
  );
}
