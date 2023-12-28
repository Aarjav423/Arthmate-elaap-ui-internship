
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
    app.use(bodyParser.json());
    app.post("/api/customer/:user_id",
      async (req, res) => {
        const data=req.body;
        const token = helper.generateToken(
          {
            user_id: req.params.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
          axios
            .get(
              `${URLS.CUSTOMER_DATA}?page=${req.body.page}&limit=${req.body.limit}&str=${req.body.str}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
            .then(response => {
              res.send(response.data);
            })
            .catch(error => {
              return res
                .status(400)
                .send(error.response.data || "Error while fetching customer");
            });
        }
      );


    app.get("/api/customer-document/:customer_id/:user_id",
      async(req,res)=>{
        const data={
          customer_id:req.params.customer_id
        }
        const token = helper.generateToken(
          {
            user_id: req.params.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
        axios.get(`${URLS.CUSTOMER_DOCS}/${req.params.customer_id}`,{
           headers: {
             Authorization: `Bearer ${token}`
           }
         })
        .then(response=>{
          res.send(response.data);
        })
        .catch(error => {
          return res
            .status(400)
            .send(error.response.data || "Error while fetching customer documents");
        });

      });

      app.post("/api/view_customer_doc", (req, res) => {
        const data = req.body;
        const token = helper.generateToken(
          {
            user_id: data.user_id,
            type: "dash-api"
          },
          60 * 5 * 1
        );
        axios.post(URLS.VIEW_CUSTOMER_DOC, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            res.send(response.data);
          })
          .catch((error) => {
            return res.status(400).json({
              message: error.response.data.message || "Error while viewing docs"
            });
          });
      });

      app.get("/api/customer-details/:customer_id/:user_id",
        async (req, res) => {
        const data=req.params;
        const token = helper.generateToken(
          {
            user_id: data?.user_id,
            type: "dash"
          },
          60 * 5 * 1
        );
          axios
            .get(
              `${URLS.GET_CUSTOMER_DETAILS}/${req.params.customer_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
            .then(response => {
              res.send(response.data);
            })
            .catch(error => {
              return res
                .status(400)
                .send(error.response.data || "Error while fetching customer details");
            });
        }
      );
};
