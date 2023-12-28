"use strict";

function includeAllRoutes(app) {
  require("./user.route.js")(app);
  require("./location.route.js")(app);
  require("./cases.route.js")(app);
  require("./agency.route.js")(app);
  require("./dashboard.route.js")(app);

}

module.exports = function (app) {
  includeAllRoutes(app);
};
