import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";
import {storedList} from "../util/localstorage";

export function tempXlsxToJsonApi(payload, id) {
  return axios.post(BASE_URL + "xlsx_to_json/" + id, payload);
}

export function addLoanTypeApi(payload) {
  return axios.post(BASE_URL + "default_loan_type", payload);
}

export function getLoanTypeApi() {
  return axios.get(BASE_URL + "default_loan_type");
}

export function getDefaultTemplatesApi(payload) {
  return axios.post(BASE_URL + "get_default_templates", payload);
}

export function getSchemaTemplatesApi(payload) {
  return axios.post(BASE_URL + "get_schema_templates", payload);
}

export function updateCustomTemplatesApi(payload) {
  const user = storedList("user") ? storedList("user") : {id: null};
  payload.user_id = user._id;
  return axios.put(BASE_URL + "custom_loan_template", payload);
}

export function getLoanTemplateNamesApi() {
  return axios.get(BASE_URL + "loan_template_names");
}

export function addLoanTemplateNamesApi(payload) {
  return axios.post(BASE_URL + "loan_template_names", payload);
}

export function getCompanyLoanSchemaApi(payload) {
  return axios.get(BASE_URL + "get_company_loanschema/" + payload);
}

export function addLoanDocTemplateApi(payload) {
  return axios.post(BASE_URL + "add_loan_doc_template", payload);
}
