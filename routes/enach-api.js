const axios = require("axios");
const bodyParser = require("body-parser");
const helper = require("../utils/helper");
const URLS = require("../constants/apiUrls");

module.exports = app => {
  app.use(bodyParser.json());

  app.post(
    "/api/emi-data/:company_id/:product_id/:page/:limit/:status/:fromRange/:toRange/:searchBy",
    async (req, res) => {
      const {
        company_id,
        product_id,
        page,
        limit,
        status,
        fromRange,
        toRange,
        searchBy
      } = req.params;
      const token = helper.generateToken(
        {
          company_id,
          product_id,
          type: "dash"
        },
        60 * 5 * 1
      );
      axios
        .get(
          `${URLS.GET_EMI_DATA}/${company_id}/${product_id}/${page}/${limit}/${status}/${fromRange}/${toRange}/${searchBy}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          return res
            .status(400)
            .json({ message: error.response?.data?.message });
        });
    }
  );

  app.post("/api/nach-presentation", async (req, res) => {
    const { company_id, product_id, user_id } = req.body.data;
    const token = helper.generateToken(
      {
        company_id,
        product_id,
        user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(
        `${URLS.SUBMIT_FOR_NACH_PRESENTATION}`,
        { TRANSACT: req.body.TRANSACT },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({ message: error.response?.data?.message });
      });
  });

  app.post(
    "/api/enach-details",
    (req, res) => {
      const data = req.body
      const payload = {
        page:data?.page,
        rowsPerPage:data?.rows_per_page,
        status:data?.status,
        fromDate:data?.fromDate,
        toDate:data?.toDate,
        company_id:data?.company_id,
        searchBy:data?.searchBy,
        user_id :data?.user_id
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
          `${URLS.GET_NACH_DETAILS}`,payload, {
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

    app.post(
      "/api/nach-suspend-registration",
      (req, res) => {
        const data = req.body
        const payload = {
        user_id: data?.user_id,
        company_id: data?.company_id,
        registrationId: data?.registrationId
        }
        const token = helper.generateToken(
          {
            company_id: data?.company_id,
            user_id: data?.user_id,
            type: "dash-api",
          }, 
          60 * 5 * 1
        );
        axios
          .post(
            `${URLS.NACH_HOLD_REGISTRATION}`,payload, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            res.send(
              "Success"
            );
          })
          .catch((error) => {
            return res
              .status(400)
              .send("Error while fetching Details.");
          });
      })
  
      app.post(
        "/api/nach-revoke-suspend-registration",
        (req, res) => {
          const data = req.body
          const payload = {
          user_id: data?.user_id,
          company_id: data?.company_id,
          registrationId: data?.registrationId
          }
          console.log("wefuihwui" ,payload);
          const token = helper.generateToken(
            {
              company_id: data?.company_id,
              user_id: data?.user_id,
              type: "dash-api",
            }, 
            60 * 5 * 1
          );
          axios
            .post(
              `${URLS.NACH_REVOKE_REGISTRATION}`,payload, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              res.send(
                "Success"
              );
            })
            .catch((error) => {
              return res
                .status(400)
                .send("Error while fetching Details.");
            });
        })
  
      app.post(
      "/api/create-subscription",
      (req, res) => {
        const data = { payloadData : req.body.submitData , userData :req.body.userData }
        const userData = req.body.userData
        const token = helper.generateToken(
          {
            company_id: userData?.company_id,
            user_id: userData.user_id,
            type: "dash-api",
          }, 
          60 * 5 * 1
        );
        axios
          .post(
            `${URLS.CREATE_SUBSCRIPTION}`,data, {
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

    app.post(
      "/api/enach-detail-by-requestId",
      (req, res) => {
        const data = req.body
        const payload = {
          request_id : data.searchBy,
          company_id : data?.companyId,
          user_id : data?.user_id
       }
        const token = helper.generateToken(
          {
            company_id: data?.companyId,
            user_id: data.user_id,
            type: "dash-api",
          }, 
          60 * 5 * 1
        );
        axios
          .post(
            `${URLS.GET_ROW_NACH_DETAIL}`,payload, {
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

      app.post(
        "/api/enach-transaction-details",
        (req, res) => {
          const data = req.body  
          const payload = {
            request_id : data.request_id,
            company_id: data?.companyId,
            search_by:data?.searchBy,
            page: data?.page,
            rows_per_page: data?.rows_per_page,
            user_id : data?.user_id
         }
          const token = helper.generateToken(
            {
              company_id: data?.companyId,
              user_id: data.user_id,
              type: "dash-api",
            }, 
            60 * 5 * 1
          );
          axios
            .post(
              `${URLS.GET_NACH_TRANSACTION_DETAIL}`,payload, {
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
        app.post(
          "/api/enach-create-presentment",
          (req, res) => {
            const data = req?.body  
            const payload = {
              request_id : data?.request_id,
              mandate_id : data?.mandate_id,
              amount : data?.amount,
              scheduled_on : data?.scheduled_on,
              user_id : data?.user_id,
              company_id : data?.company_id,
              company_id_subscription : data?.company_id_subscription,
                old_presentment_txn_id : data?.old_presentment_txn_id
            }
            const token = helper.generateToken(
              {
                user_id: data.user_id,
                company_id: data?.company_id,
                type:"dash-api"
              },
              60 * 5 * 1
            );
            axios
              .post(
                `${URLS.POST_NACH_PRESENTMENT_DETAIL}`,payload, {
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
                  .send(error?.response?.data || "Error while creating presentment.");
              });
          })
  
          app.post(
            "/api/enach-get-generated-token",
            (req, res) => {
              const data = req.body  
              const payload = {
                user_id : data?.user_id,
                company_id : data?.company_id
              }
              const token = helper.generateToken(
                {
                  user_id: data?.user_id,
                  company_id: data?.company_id,
                  type:"dash-api"
                },
                60 * 5 * 1
              );
              axios
                .post(
                  `${URLS.GET_NACH_GENERATE_TOKEN}`,payload, {
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
                    .send(error?.response?.data || "Error while generating token.");
                });
            })
            app.post(
              "/api/enach-purpose",
              (req, res) => {
                const data = req.body  
                const payload = {
                  user_id : data?.user_id,
                  company_id : data?.company_id
                }  
                const token = helper.generateToken(
                  {
                    user_id: data?.user_id,
                    company_id: data?.company_id,
                    type:"dash-api"
                  },
                  60 * 5 * 1
                );
                axios
                  .post(
                    `${URLS.GET_NACH_PURPOSE_DETAIL}`,payload, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((response) => {
                    res.send(response?.data?.data);
                  })
                  .catch((error) => {
                    return res
                      .status(400)
                      .send(error?.response?.data || "Error while gettiing purpose of mandate.");
                  });
              })

    app.post(
        "/api/nach-cancel-registration",
        (req, res) => {
            const data = req.body
            const payload = {
                user_id: data?.user_id,
                company_id: data?.company_id,
                registrationId: data?.registrationId
            }
            const token = helper.generateToken(
                {
                    company_id: data?.company_id,
                    user_id: data?.user_id,
                    type: "dash-api",
                },
                60 * 5
            );
            axios.post(
                    `${URLS.NACH_CANCEL_REGISTRATION}`,payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {
                    res.send("Success");
                })
                .catch(() => {
                    return res.status(400).send("Error while cancelling subscription");
                });
        })
  
        app.post(
          "/api/nach-live-bank-status",
          (req, res) => {
              const data = req.body
              const token = helper.generateToken(
                  {
                      company_id: data?.company_id,
                      user_id: data?.user_id,
                      type: "dash-api",
                  },
                  60 * 5
              );
              axios.get(
                  `${URLS.GET_NACH_LIVE_BANK_DETAILS}`,
                  {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  }
              )
                  .then((response) => {
                      res.status(200).send(response?.data);
                  })
                  .catch((error) => {
                      return res.status(400)
                          .send(error?.response?.data || "Error while fetching live bank details");
                  });
          }
        );
  
        app.post(
          "/api/loan-details-nach",
          (req, res) => {
              const data = req.body
              const token = helper.generateToken(
                  {
                      company_id: data?.company_id,
                      user_id: data?.user_id,
                      type: "dash-api",
                  },
                  60 * 5
              );
              axios.get(
                  `${URLS.GET_LOAN_DETAILS_NACH}/${data?.external_ref_num}`,
                  {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  }
              )
                  .then((response) => {
                      res.status(200).send(response?.data);
                  })
                  .catch((error) => {
                    return res.status(400)
                          .send(error?.response?.data || "Error while fetching loan details nach");
                  });
          }
        );
    
};


