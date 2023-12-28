"use strict";

function includeAllRoutes(app) {
  require("./status.route.js")(app)
  require("./bookLoan.route.js")(app);
  require("./lead.route.js")(app);
  require("./agency.route.js")(app);
  require("./msme.route.js")(app);

}

module.exports = function (app) {
  includeAllRoutes(app);
};
