"use strict";
const bodyParser = require("body-parser");
const helper = require("../../utils/helper");
const passport = require("passport");
const URLS = require("../../constants/apiUrls");
const axios = require("axios");
module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/collection/cases",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const queryParams = req.query;
      axios
        .get(URLS.GET_COLL_CASES_LIST, {
          params: queryParams,
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/cases/assigned",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const queryParams = req.query;
      axios
        .get(`${URLS.GET_COLLECTION_CASES_ASSIGN}`, {
          params: queryParams,
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/cases/lms-id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const query = req.query;

      axios
        .get(`${URLS.GET_COLLECTION_CASE_LMS_ID}`, {
          params: query, // Pass the query parameter to the Axios request
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.post(
    "/api/collection/cases/coll-id",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          ...req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .post(`${URLS.GET_COLLECTION_CASE_COLL_ID}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.post(
    "/api/collection/cases/select",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          ...req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );

      axios
        .post(`${URLS.GET_COLLECTION_CASE_SELECTED}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/cases/:caseId",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const caseId = req.params.caseId;
      axios
        .get(`${URLS.GET_COLL_CASE_BY_ID}/${caseId}`, {
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );
  app.post(
    "/api/collection/assign-cases",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const payload = req.body;
      const token = helper.generateToken(
        {
          ...req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.ASSIGN_COLL_CASES, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.post(
    "/api/collection/deassign-cases",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const {user, ...payload} = req.body;
      const token = helper.generateToken(
        {
          ...req.body.user,
          type: "dash-api",
        },
        60 * 5 * 1
      );
      axios
        .post(URLS.DE_ASSIGN_COLL_CASES, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/cases/companies",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const queryParams = req.query;
      axios
        .get(`${URLS.GET_CASE_SOURCING_PARTNER}`, {
          headers: {
            Authorization: req.headers["authorization"],
          },
          params: queryParams,
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/cases/history/:collID",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const collId = req.params.collID;
      const queryParams = req.query;
      axios
        .get(`${URLS.GET_COLL_HISTORY_BY_ID}/${collId}`, {
          params: queryParams,
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.get(
    "/api/collection/cases/payment/:caseID",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const caseId = req.params.caseID;
      axios
        .get(`${URLS.GET_COLL_CASE_PAYMENT_BY_ID}/${caseId}`, {
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );

  app.post(
    "/api/collection/cases/logs/view-document",
    [passport.authenticate("jwt", { session: false })],
    (req, res) => {
      const data = req.body;
      axios
        .post(`${URLS.CASE_VIEW_LOAN_DOCUMENT_LOGS}`, data, {
          headers: {
            Authorization: req.headers["authorization"],
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(400).send(error?.response?.data);
        });
    }
  );            
};
