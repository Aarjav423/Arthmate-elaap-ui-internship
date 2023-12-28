const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const axios = require("axios");
const URLS = require("../constants/apiUrls");


module.exports = app => {
  app.use(bodyParser.json());
  
  app.post("/api/recalibrate-sanction/:loan_id", (req, res) => {
    const userData = req.body.userData;
    const data = req.body.submitData;
    //generate token
    const token = helper.generateToken(
      {
        company_id: userData.company_id,
        user_id: userData.user_id,
        product_id: userData.product_id,
        type: "dash",
      },
      60 * 5 * 1
    );
    
    axios.patch(`${URLS.RECALIBRATE_SANCTION}/${req.params.loan_id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while updating loan details."
        });
      });
  });
  
}
