import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function addloanSchemaApi(payload) {
  return axios.post(BASE_URL + "loanschema", payload);
}

export function getLoanSchemaByCompanyIdApi(payload) {
  return axios.get(`${BASE_URL}${"loanschema"}/${payload.company_id}`);
}

export function updateLoanSchemaApi(payload) {
  return axios.put(`${BASE_URL}${"loanschema"}`, payload);
}

export function loadTemplateEnumsApi(payload) {
  return axios.post(`${BASE_URL}${"fetch_enum_fields"}`, payload);
}
