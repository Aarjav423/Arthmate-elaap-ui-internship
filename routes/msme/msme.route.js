const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post("/api/msme/applicant-details", (req, res) => {
    const data = req.body;
    axios
      .post(`${URLS.POST_MSME_APPLICANT_DETAILS}`, data)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response.data || "Error while posting applicant details");
      });
  });

  app.post("/api/msme/section-details", (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: data.msme_company_id,
        product_id: data.msme_product_id,
        user_id: data.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );

    axios
      .patch(`${URLS.PATCH_MSME_SECTION_DETAILS}/${data.loan_app_id}`, data,{
        headers: {
          Authorization: `Bearer ${token}`,
        }})
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response?.data || "Error while posting section details");
      });
  });

  app.post("/api/msme/save-draft", (req, res) => {
    const token = helper.generateToken(
      { ...req.body?.tokenData, type: "dash-api" },
      60 * 5 * 1
    );

    axios
      .put(
        `${URLS.PUT_MSME_SAVE_DRAFT}/${req.body?.loan_app_id}/draft/`,
        req.body?.bodyData,
        {
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
          .send(
            error.response.data || "Error while saving entity detail draft"
          );
      });
  });

  app.get("/api/msme/company", (req, res) => {
    axios
      .get(URLS.MSME_LIST_COMPANIES)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while getting partners",
        });
      });
  });

  app.get("/api/get_products_by_msme_company_id/:_id", (req, res) => {
    const data = req.body;
    axios
      .get(`${URLS.PRODUCT_BY_MSME_COMPANY}/${req.params._id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while getting products",
        });
      });
  });

  app.post("/api/msme/delete-docs", 
  (req, res) => {
    const query = req.body;
    let tokenPayload={};
    if(query.tokenData){
      tokenPayload = {
        company_id: query?.tokenData.company_id,
        product_id: query?.tokenData.product_id,
        user_id: query?.tokenData.user_id,
        type: "dash-api"
      }
    }
    else{
      tokenPayload={
        company_id: query?.company_id,
        product_id: query?.product_id,
        user_id: query?.user?._id,
        type: "dash-api"}
    }
     
    const token = helper.generateToken(
      { ...tokenPayload },
      60 * 5 * 1
    );

  axios
    .patch(`${URLS.MSME_DOC_DELETE}`, query,{
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
        .send(error.response.data || "Error while deleting document");
    });
  });

  app.post("/api/msme/get-BIC-data/:loan_app_id",
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          company_id: payload.company_id,
          product_id: payload.product_id,
          user_id: payload.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios
        .get(`${URLS.GET_MSME_BIC_DATA}/${payload.loanAppId}`, {
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
            .send(error.response.data || "Error while fetching BIC Data");
        });
    });

  app.delete("/api/msme/lead/:loan_app_id/section/:section_sequence_no/subsection/:sub_section_code", 
  (req, res) => {
    const payload = req.body;
      const token = helper.generateToken(
        {
          company_id: payload.tokenData.company_id,
          product_id: payload.tokenData.product_id,
          user_id: payload.tokenData.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
  axios
    .delete(`${URLS.CREATE_LOANID}/${payload.loan_app_id}/section/${payload.section_code}/subsection/${payload.sub_section_code}`,{
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
        .send(error.response.data || "Error while deleting section");
    });
  });

  app.post("/api/msme/create-esign-request", 
  (req, res) => {
    const payload = req.body;
    const data = {
      loan_app_id:payload.loan_app_id ,
      doc_code: payload.doc_code
     }
      const token = helper.generateToken(
        {
          company_id: payload.company_id,
          product_id: payload.product_id,
          user_id: payload.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
  axios
    .post(`${URLS.POST_ESIGN_REQUEST}`,data,{
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
        .send(error);
    });
  });

    app.put("/api/msme/update-lead-deviation",
    (req,res)=>{
      const data= req.body;
      const token = helper.generateToken(
        {
          company_id: data.msme_company_id,
          product_id: data.msme_product_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios.put(`${URLS.UPDATE_LEAD_DEVIATION}/${data.loan_app_id}/update-offer-deviation`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response.data || "Error while deleting document");
      });
    });

    app.post("/api/msme/ammend-offer-api",
    (req,res)=>{
      const data= req.body;
      const user= data.user;
      const token = helper.generateToken(
        {
          ...user,
          company_id: data.msme_company_id,
          product_id: data.msme_product_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      console.log(`${URLS.AMMEND_OFFER_API}`,token);
      axios.post(`${URLS.AMMEND_OFFER_API}`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response.data || "Error while deleting document");
      });
    });
    app.post("/api/msme/leads/aadhaarCheck",
    (req,res)=>{
      const data= req.body;
      const user= data.user;
      const token = helper.generateToken(
        {
          ...user,
          company_id: data.company_id,
          product_id: data.product_id,
          user_id: data.user_id,
          type: "dash-api"
        },
        60 * 5 * 1
      );
      axios.post(`${URLS.VERIFY_AADHAAR_OTP}`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res
          .status(400)
          .send(error.response.data || "Error while verifying document");
      });
    });

};
// function includeAllRoutes(app) {
//   require("./agency.route.js")(app);
// }

// module.exports = function (app) {
//   includeAllRoutes(app);
// };
