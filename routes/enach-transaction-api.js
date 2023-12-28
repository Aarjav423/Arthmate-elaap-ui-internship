const axios = require("axios");
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");

module.exports = app => {
  app.use(bodyParser.json());

  app.post(
    "/api/enach-transactions-details",
    (req, res) => {
      const data = req.body
      const payload = {
        page:data?.page,
        rows_per_page:data?.rows_per_page,
        status:data?.status,
        from_date:data?.from_date,
        to_date:data?.to_date,
        companyId:data?.company_id,
        search_by:data?.search_by,
        user_id: data.user_id,
      }
      const token = helper.generateToken(
        {
          company_id: data?.company_id,
          user_id: data.user_id,
          type: "dash-api",
        }, 
        60 * 5 * 1
      );
      axios
        .post(
          `${URLS.GET_ENACH_DETAILS_NACH_TRANSACTION}`,payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res
            .status(400)
            .send(error?.response?.data || "Error while fetching Details.");
        });
    })  
};


