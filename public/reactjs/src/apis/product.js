import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function createProductApi(payload) {
  return axios.post(BASE_URL + "product", payload);
}

export function getAllProductByCompanyIdApi(payload) {
  return axios.get(`${BASE_URL}${"get_products_by_company_id"}/${payload}`);
}

export function getAllProductByLocCompanyIdApi(payload) {
  return axios.get(`${BASE_URL}${"get_products_by_loc_company_id"}/${payload}`);
}

export function toggleProductStatusApi(payload) {
  return axios.post(BASE_URL + "product/status", payload);
}

export function getPostmanCollectionLoanBookApi(payload) {
  return axios.post(BASE_URL + "postman/loanbook", payload);
}

export function getProductByIdApi(payload) {
  return axios.get(`${BASE_URL}${"product"}/${payload}`);
}

export function companyProductIdAPI(payload) {
  return axios.post(BASE_URL + "product_dues", payload);
}

export function getProductByCompanyApi(payload) {
  return axios.get(BASE_URL + "products/" + payload);
}

export function createProductWithConfigApi(payload) {
  return axios.post(
    `${BASE_URL}${"product"}/${payload.company_id}/${payload.loan_schema_id}/${
      payload.product_id
    }`,
    payload
  );
}
