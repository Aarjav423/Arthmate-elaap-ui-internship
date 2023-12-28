"use strict";
const { check, validationResult, body } = require("express-validator");
const axios = require("axios");
const helper = require("../utils/helper");
const auth = require("../services/auth/auth");
const passport = require("passport");
const URLS = require("../constants/apiUrls");
const bodyParser = require("body-parser");

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get(
    "/api/user",
    [
      passport.authenticate("jwt", { session: false }),
      auth.ensureHasType("admin"),
    ],
    (req, res, next) => {
      axios
        .get(URLS.USER_URL)
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while getting user list",
          });
        });
    }
  );

  app.post(
    "/api/user",
    [
      check("username").notEmpty().withMessage("Please enter username"),
      check("email").notEmpty().withMessage("Please enter email id"),
      check("type").notEmpty().withMessage("Please select user type"),
      check("userroles").notEmpty().withMessage("Please select user roles"),
    ],
    [
      passport.authenticate("jwt", { session: false }),
      auth.ensureHasType("admin"),
    ],
    (req, res) => {
      const userData = req.body;
      userData.created_by=req.user.username
      userData.updated_by=req.user.username
      const type = userData.type;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.errors[0]["msg"] });
      } else {
        if (type === "company" && !userData.company_id)
          return res.status(400).send({ message: "Select User company" });
        const password = helper.generateRandomPassword();
        userData.userpass = password;
        userData.userpassToEmail = password;
        //userData.updatedby = req.user.username;
        axios
          .post(URLS.USER_URL, userData, {})
          .then((response) => {
            res.json(response.data);
          })
          .catch((error) => {
            return res.status(404).send({
              message:
                error.response.data.message || "Error while creating user",
            });
          });
      }
    }
  );

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(400).send(err);
      if (!user)
        return res
          .status(400)
          .send({ message: "Invalid username or password!" });
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Could not log in user",
          });
        }
        user.userpass = null;
        res.json({
          token: info.token,
          user: user,
        });
      });
    })(req, res, next);
  });

  //Update user
  app.put(
    "/api/user",
    [
      passport.authenticate("jwt", { session: false }),
      auth.ensureHasType("admin"),
    ],
    (req, res) => {
      const userData = req.body;
      axios
        .put(URLS.USER_URL, userData, {})
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message ||
              "Error while updating user status ",
          });
        });
    }
  );

  //update user
  app.put(
    "/api/user/:id",
    [
      check("username").notEmpty().withMessage("Please enter username"),
      check("email").notEmpty().withMessage("Please enter email id"),
      check("type").notEmpty().withMessage("Please select user type"),
      check("userroles").notEmpty().withMessage("Please select user roles"),
    ],
    [
      passport.authenticate("jwt", { session: false }),
      auth.ensureHasType("admin"),
    ],
    (req, res) => {
      const userData = req.body;
      userData.updated_by=req.user.username
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ message: errors.errors[0]["msg"] });
      axios
        .put(`${URLS.UPDATE_USER}/${userData.id}`, userData, {})
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          return res.status(404).send({
            message:
              error.response.data.message || "Error while updating user data ",
          });
        });
    }
  );

  app.post("/api/resetpassword", (req, res) => {
    const userData = req.body;
    if (userData.type === "admin") {
      const password = helper.generateRandomPassword();
      userData.confirmPassword = password;
    }
    axios
      .post(`${URLS.RESET_PASSWORD}`, userData, {})
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        return res.status(404).send({
          message:
            error.response.data.message || "Error while resetting password",
        });
      });
  });

  app.post("/api/usersearch", (req, res) => {
    const userData = req.body;
    axios
      .post(`${URLS.SEARCH_USER}`, userData, {})
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        return res.status(404).send({
          message:
            error.response.data.message || "Error while searching user data",
        });
      });
  });

};
