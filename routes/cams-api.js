const helper = require("../utils/helper");
const axios = require("axios");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");
module.exports = app => {
  app.use(bodyParser.json());

  app.post("/api/cams-details/:loan_app_id", (req, res) => {
    const body = req.body;
    const loanAppId = body.loan_app_id;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        loan_schema_id: body.loan_schema_id,
        user_id: body.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    delete body.company_id;
    delete body.product_id;
    delete body.user_id;
    delete body.loan_app_id;
    delete body.__v;
    delete body._id;
    delete body.loan_app_id;

    axios
      .post(`${URLS.CAMS_DETAILS}/${loanAppId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while submitting cams details."
        });
      });
  });

  app.post("/api/udhyam-aadhar-OCR-data/:loan_app_id", (req, res) => {
    const body = req.body;
    const { loan_app_id } = req.params;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        user_id: body.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );

    axios
      .get(`${URLS.URC_PARSED_DETAILS}/${loan_app_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while getting URC parsed details."
        });
      });
  });

  app.get("/api/cams-details/:loan_app_id", (req, res) => {
    const { loan_app_id } = req.params;
    axios
      .get(`${URLS.GET_CAMS_DETAILS}/${loan_app_id}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Cams details not found against loan_app_id."
        });
      });
  });

  app.post("/api/fetch-bre-details", (req, res) => {
    const data = req.body
    axios
      .post(`${URLS.GET_BRE_DETAILS}`, data, {})
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response?.data?.message ||
            "Error while fetching BRE details"
        });
      });
  });

  app.put("/api/run-credit-engine", (req, res) => {
    const data = req.body
    axios
      .put(`${URLS.RUN_CREDIT_ENGINE}`, data, {})
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error?.response?.data?.message ||
            "Error while running BRE"
        });
      });
  });

  app.post("/api/lead/:loan_app_id", (req, res) => {
    const { loan_app_id } = req.params;
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: "dash-api"
      },
      60 * 5 * 1
    );
    axios
      .get(`${URLS.GET_SELECTOR_DETAILS}/${loan_app_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Lead details not found against loan_app_id."
        });
      });
  });

  app.get("/api/selector-basic-details/:loan_app_id", (req, res) => {
    const { loan_app_id } = req.params;
    const body = req.body;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        loan_schema_id: body.loan_schema_id,
        user_id: body.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );

    axios
      .get(`${URLS.SELECTOR_BY_ID_WATCHER}/${loan_app_id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "selector details not found against loan_app_id."
        });
      });
  });

  app.post("/api/selector-details", (req, res) => {
    const body = req.body;
    const loanAppId = body.loan_app_id;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        loan_schema_id: body.loan_schema_id,
        user_id: body.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.POST_SELECTOR_DETAILS}`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message ||
            "Error while submitting selector details."
        });
      });
  });

  app.post("/api/selector-response", (req, res) => {
    const body = req.body;
    const loanAppId = body.loan_app_id;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        loan_schema_id: body.loan_schema_id,
        user_id: body.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    axios
      .post(`${URLS.POST_SELECTOR_COLENDER_DETAILS}`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message: error?.response?.data?.message || "Bad request"
        });
      });
  });

  app.put("/api/cams-details/:loan_app_id", (req, res) => {
    const { loan_app_id } = req.params;
    const body = req.body;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        loan_schema_id: body.loan_schema_id,
        user_id: body.user_id,
        type: "dash"
      },
      60 * 5 * 1
    );
    delete body.company_id;
    delete body.product_id;
    delete body.user_id;
    delete body.loan_app_id;
    delete body._id;
    delete body.__v;
    delete body.loan_app_id;

    axios
      .put(`${URLS.UPDATE_CAMS_DETAILS}/${loan_app_id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        return res.status(400).json({
          message:
            error.response.data.message || "Error while updating cams details."
        });
      });
  });

  app.patch('/api/msme/leads/cams/:loan_app_id', (req, res) => {
    const body = req.body;
    const params = req.params;
    const token = helper.generateToken(
      {
        company_id: body.company_id,
        product_id: body.product_id,
        loan_schema_id: params.loan_app_id,
        user_id: body.user_id,
        type: 'dash-api',
      },
      60 * 5 * 1,
    );

    console.log(token, "tokentokentoken")
    axios
      .patch(`${URLS.UPDATE_CAMS_DATA}${params.loan_app_id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error, 'errorerrorerror');
        return res.status(400).json({
          message: error?.response?.data?.message || 'Bad request',
        });
      });
  });

  app.get('/api/msme/leads/cams/:loan_app_id', (req, res) => {
    const query = req.query;
    const params = req.params;
    const token = helper.generateToken(
      {
        company_id: query.company_id,
        product_id: query.product_id,
        loan_schema_id: query.loan_app_id,
        user_id: query.user_id,
        type: 'dash-api',
      },
      60 * 5 * 1,
    );

    console.log("params", params);

    axios
      .get(`${URLS.GET_CAMS_DATA}${params.loan_app_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error, 'errorerrorerror');
        return res.status(400).json({
          message: error?.response?.data?.message || 'Bad request',
        });
      });
  });

  app.get('/api/cam-details/:loan_app_id', (req, res) => {
    const { loan_app_id } = req.params;
    axios
      .get(`${URLS.GET_CAM_DETAILS}/${loan_app_id}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          message: error?.response?.data?.message ?? 'Cam details were not found for the provided loan app id.',
        });
      });
  });
};


