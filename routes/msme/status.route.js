const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/api/msme/leads/section-status",
    (req, res) => {
      const loan_app_id = req.body.loanAppID;
      const user = req.body.user;
      // const user = JSON.parse(query["user"]);
      const token = helper.generateToken(
        {
          ...user,
          company_id:req.body.company_id,
          product_id:req.body.product_id,
          user_id: user._id,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .get(URLS.GET_LEAD_SECTION_STATUS+`/${loan_app_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
// }

// app.get("/api/msme/lead/section-status/", (req, res) => {
//   axios
//     .get(URLS.GET_LEAD_SECTION_STATUS+`/${req.params.loanAppID}`)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch((error) => {
//       return res.status(400).json({
//         message:
//           error.response.data.message || "Error while getting partners",
//       });
//     });
// });
}
