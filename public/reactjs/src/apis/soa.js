import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getSoaDetails(payload) {
  return axios.get(`${BASE_URL}soa-request/${payload.company_id}/${payload.product_id}/${payload.loan_id}` , payload);
}

export function getSoaRequest(payload) {
  return axios.post(`${BASE_URL}soa-request/generate/${payload.company_id}/${payload.product_id}/${payload.loan_id}` , payload);
}

export function downloadSoaRequest(payload) {
  return axios.post(`${BASE_URL}soa-request/download/${payload.company_id}/${payload.product_id}/${payload.loan_id}/${payload.requestId}` , payload);
}