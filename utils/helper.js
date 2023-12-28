"use strict";
const bCrypt = require("bcryptjs");
const axios = require("axios");
const path = require("path");
var jwt = require("jsonwebtoken");
const generator = require("generate-password");
const xlsxtojson = require("xlsx-to-json");
const xlstojson = require("xls-to-json");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");
let fileExtension = require("file-extension");

const generateToken = (obj, expiresIn) => {
  obj.environment = process.env.ENVIRONMENT;
  return jwt.sign(obj, process.env.SECRET_KEY);
};

const generateCoLenderToken = (obj, expiresIn) => {
  obj.environment = process.env.ENVIRONMENT;
  return jwt.sign(obj, process.env.CO_LENDER_SECRET_KEY);
}

//compare password for authentication
const comparePassword = (userPassword, hash, callback) => {
  bCrypt.compare(userPassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

const generateRandomPassword = () => {
  return generator.generate({
    length: 8,
    uppercase: true,
    numbers: true,
    excludeSimilarCharacters: true,
    strict: true,
    symbols: true,
    exclude: "~$%^()_/+\"*-={}<>[];':,.",
  });
};

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

/**
 * Helper to check empty object
 */
const checkNotEmpty = (item) => {
  if (!item) return false;
  const objKeys = Object.keys(item);
  const filtered = objKeys.filter((key) => {
    return item[key] == "";
  });
  return objKeys.length != filtered.length;
};

/**
 * Helper to configure storage
 */
const storage = multer.diskStorage({
  //multers disk storage settings
  destination: (req, file, cb) => {
    cb(null, "./input/");
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(
        null,
        raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
      );
    });
  },
});

/**
 * Helper to upload xls to path
 */
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype == "application/wps-office.xlsx" ||
      file.mimetype == "application/octet-stream"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .xlsx format is allowed!"));
    }
  },
}).single("file");

const parseFileTojson = (req, res, callback) => {
  let excel2json;
  /** Helper to upload xlsx to path */
  upload(req, res, (err) => {
    if (err) return res.status(401).send({ message: err.message });
    /** Multer gives us file info in req.file object */
    if (!req.file)
      return res.status(404).send({ message: "Please provide file" });
    /** SET nodejs package as per the file received...*/
    var fileName =
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
    excel2json = fileName === "xlsx" ? xlsxtojson : xlstojson;
    const jsonFilePath = "output/" + Date.now() + ".json";
    excel2json(
      {
        input: req.file.path, // input xlsx
        output: jsonFilePath, // output json
        lowerCaseHeaders: true,
      },
      (err, result) => {
        if (err) {
          return res.status(404).send({ err });
        } else {
          fs.unlink(path.join(req.file.path), (err) => {
            if (err) throw err;
          });
          fs.unlink(path.join(jsonFilePath), (err) => {
            if (err) throw err;
          });
          const finalData = result.filter((item) => {
            /** Helper to delete empty objects */
            return checkNotEmpty(item);
          });
          if (finalData.length < 1)
            return res.status(404).send({ message: "File is empty" });
          callback(null, finalData);
        }
      }
    );
  });
};

module.exports = {
  comparePassword,
  generateToken,
  generateRandomPassword,
  createHash,
  parseFileTojson,
  upload,
  storage,
  checkNotEmpty,
  generateCoLenderToken
};
