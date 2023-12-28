import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function addCompanyApi(payload) {
  return axios.post(BASE_URL + "company", payload);
}

export function getAllCompaniesApi() {
  return axios.get(BASE_URL + "company");
}

export function getAllLocCompaniesApi() {
  return axios.get(BASE_URL + "loc-company");
}

export function getAllCoLenderCompaniesApi() {
  return axios.get(BASE_URL + "co-lender-company");
}

export function getCompanyByIdApi(payload) {
  return axios.get(`${BASE_URL}${"company"}/${payload}`);
}
