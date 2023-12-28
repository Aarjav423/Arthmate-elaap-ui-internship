import { id } from "date-fns/locale";
import { dayDateFormat } from "util/helper";
import { monthDateFormat } from "util/helper";
import { generateRandomColor } from "util/helper";
import { sortByKey } from "util/helper";

const { compareDates } = require("util/helper");

/**
 * @description formats lead data
 * @param {*} lead_data 
 * @returns lead data json
 */
export const leadFunction = (lead_data) => {
  var temp_obj = { xAxis: [], yAxis: [], maxValue: 0 }; // stores inital value 

  for (let object of lead_data) {
    if (object[`total_leads`] > temp_obj.maxValue) {
      temp_obj["maxValue"] = object["total_leads"];
    }
    temp_obj.xAxis.push(dayDateFormat(object["date"]));
    temp_obj.yAxis.push(object["total_leads"]);
  }

  return temp_obj;
};

/**
 * @description formats loan data
 * @param {*} load_data 
 * @returns loan data json
 */
export const loanFunction = (loan_data) => {
  var temp_obj = { xAxis: [], yAxis: [], maxValue: 0 }; // stores inital value 
  for (let object of loan_data) {
    if (object[`total_loans`] > temp_obj.maxValue) {
      temp_obj["maxValue"] = object["total_loans"];
    }
    temp_obj.xAxis.push(dayDateFormat(object["date"]));
    temp_obj.yAxis.push(object["total_loans"]);
  }

  return temp_obj;
};

/**
 * @description formats service data
 * @param {*} json_array 
 * @returns service data json
 */
export const serviceUsageFunction = (json_array) => {
  var types = {};
  var types_color = [];
  var id = 0;
  var maxValue = 0;
  var arr = [];
  var xAxis = [];
  var len = json_array.length;
  var value;

  for (var i = 0; i < len; i++) {
    for (let service of json_array[i]["services"]) {
      if (!service["api"]) continue;

      value = types[service["api"]];
      if (!value && value != 0) {
        types[service["api"]] = id;
        value = id++;
        arr[value] = new Array(len).fill(0);
      }

      arr[value][i] = service["count"];
      if (service["count"] > maxValue) {
        maxValue = service["count"];
      }
    }

    xAxis.push(monthDateFormat(json_array[i]["month"]));
  }


  var types_array = Object.keys(types);

  for (var i = 0; i < types_array.length; i++) {
    types_color.push(generateRandomColor());
  }

  return {
    xAxis: xAxis,
    yAxis: arr,
    maxValue: maxValue,
    types: types_array,
    typesColor: types_color,
  };
};

/**
 * @description combine lead and loan data into one
 * @param {*} lead_data 
 * @param {*} loan_data 
 * @returns lead loan json
 */
export const leadLoanFunction = (lead_data, loan_data) => {

  var types = {
    Lead: 0,
    Loan: 1,
  };
  var types_color = [
    "rgb(137,129,13,0.6899561946615204)",
    "rgb(212,52,120,0.6625571647675316)",
  ];
  var maxValue = 0;
  var xAxis = [];
  var yAxis = [[], []];
  var len = lead_data.length;

  for (var i = 0; i < len; i++) {
    var lead_object = lead_data[i];
    var loan_object = loan_data[i];


    if (lead_object[`total_leads`] > maxValue) {
      maxValue = lead_object["total_leads"];
    }

    if (loan_object[`total_loans`] > maxValue) {
      maxValue = loan_object["total_loans"];
    }

    xAxis.push(dayDateFormat(lead_object["date"]));
    yAxis[types["Lead"]].push(lead_object["total_leads"]);
    yAxis[types["Loan"]].push(loan_object["total_loans"]);
  }

  return {
    xAxis: xAxis,
    yAxis: yAxis,
    maxValue: maxValue,
    types: Object.keys(types),
    typesColor: types_color,
  };
};

/**
 * @desdcription formats dpd data
 * @param {*} dpd 
 * @returns dpd json
 */
export const dpdFunction = (dpd) => {
  var temp_obj = {
    xAxis: [],
    yAxis: [[], [], [], [], []],
    maxValue: 0,
    maxValue2: 0,
    types: [],
    yAxisTypes: [],
    typesColor: [],
  };

  var types = {
    Count: 0,
    "Principal Outstanding": 1,
    "Interest Outstanding": 2,
    "Principal Due": 3,
    "Interest Due": 4,
  };

  for (var i = 0; i < dpd.length; i++) {

    if (dpd[i]["dpd_range"] == "90+") {
      dpd[i]["dpd_avg"] = 105;
    } else if (!dpd[i]["dpd_range"]) {
      dpd[i]["dpd_avg"] = 0;
    }else{
      var temp_ar = dpd[i]["dpd_range"].split("-");
      dpd[i]["dpd_avg"] = (parseInt(temp_ar[0]) + parseInt(temp_ar[1])) / 2;
    }
  }

  dpd = sortByKey(dpd, "dpd_avg");

  temp_obj["types"] = Object.keys(types);
  temp_obj["yAxisTypes"] = ["line", "bar", "bar", "bar", "bar"];

  for (var i = 0; i < dpd.length; i++) {
    let object = dpd[i];

    if(!object['dpd_range'])
      continue;

    temp_obj["maxValue"] = Math.max(
      temp_obj["maxValue"],
      parseFloat(object["principal_outstanding"]) +
        parseFloat(object["interest_outstanding"]) +
        parseFloat(object["principal_due"]) +
        parseFloat(object["interest_due"])
    );

    temp_obj["maxValue2"] = Math.max(temp_obj["maxValue2"], object["count"]);

    temp_obj.xAxis.push(object["dpd_range"]);
    temp_obj.yAxis[0].push(object["count"]);
    temp_obj.yAxis[1].push(object["principal_outstanding"]);
    temp_obj.yAxis[2].push(object["interest_outstanding"]);
    temp_obj.yAxis[3].push(object["principal_due"]);
    temp_obj.yAxis[4].push(object["interest_due"]);
  }


  temp_obj["typesColor"] = [
    "#fc030b",
    "#0373fc",
    "#03fcad",
    "#03a1fc",
    "#fcad03",
  ];

  return temp_obj;
};

/**
 * @description formats daily disbursed loans
 * @param {*} daily_disbursed_loan 
 * @returns daily disbursed loan json
 */
export const dailyDisbursedLoanFunction = (daily_disbursed_loan) => {

  var temp_obj = {
    xAxis: [],
    yAxis: [[], []],
    maxValue: 0,
    maxValue2: 0,
    types: [],
    yAxisTypes: [],
    typesColor: [],
  }; // stores inital value 

  var types = {
    "Disbursed Loan Count": 0,
    "Net Disbursed Amount": 1,
  };

  temp_obj["types"] = Object.keys(types);
  temp_obj["yAxisTypes"] = ["line", "bar"];

  for (var i = 0; i < daily_disbursed_loan.length; i++) {
    let object = daily_disbursed_loan[i];

    temp_obj["maxValue"] = Math.max(
      temp_obj["maxValue"],
      parseFloat(object["net_disbursement_value"])
    );

    temp_obj["maxValue2"] = Math.max(
      temp_obj["maxValue2"],
      object["disbursed_loan_count"]
    );

    temp_obj.xAxis.push(dayDateFormat(object["date"]));
    temp_obj.yAxis[0].push(object["disbursed_loan_count"]);
    temp_obj.yAxis[1].push(object["net_disbursement_value"]);
  }

  temp_obj["typesColor"] = ["#fc030b", "#0373fc"];

  return temp_obj;
};
