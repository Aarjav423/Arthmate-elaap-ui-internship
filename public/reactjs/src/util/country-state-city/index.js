"use strict";

//import * as country_json_1 from "./country-state-city/lib/country.json";
var country_json_1 = JSON.parse(
  require("./country-state-city/lib/country.json").toString()
);
var json = require("./data.json");
var state_json_1 = JSON.parse(
  fs.readFileSync("./country-state-city/lib/state.json").toString()
);

var city_json_1 = JSON.parse(
  fs.readFileSync("./country-state-city/lib/city.json").toString()
);

//import * as state_json_1 from "./country-state-city/lib/state.json";
//import * as city_json_1 from "./country-state-city/lib/city.json";

exports.default = {
  getCountryById: function (id) {
    return _findEntryById(country_json_1.default, id);
  },
  getStateById: function (id) {
    return _findEntryById(state_json_1.default, id);
  },
  getCityById: function (id) {
    return _findEntryById(city_json_1.default, id);
  },
  getStatesOfCountry: function (countryId) {
    var states = state_json_1.default.filter(function (value, index) {
      return value.country_id === countryId;
    });
    return states.sort(compare);
  },
  getCitiesOfState: function (stateId) {
    var cities = city_json_1.default.filter(function (value, index) {
      return value.state_id === stateId;
    });
    return cities.sort(compare);
  },
  getAllCountries: function () {
    return country_json_1.default;
  },
  getCountryByCode: function (code) {
    return _findEntryByCode(country_json_1.default, code);
  },
};
var _findEntryById = function (source, id) {
  if (id && source != null) {
    var idx = source.findIndex(function (c) {
      return c.id === id;
    });
    return idx !== -1 ? source[idx] : "";
  } else return "";
};
var _findEntryByCode = function (source, code) {
  if (code && source != null) {
    var codex = source.findIndex(function (c) {
      return c.sortname === code;
    });
    return codex !== -1 ? source[codex] : "";
  } else return "";
};
function compare(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}
