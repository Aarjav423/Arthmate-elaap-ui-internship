import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getPendingRepaymentList(payload) {
  return axios.post(
    `${BASE_URL}pending-repayment-records/${payload.company_id}/${payload.product_id}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function approveRepayments(payload) {
  return axios.post(`${BASE_URL}repayment-approve`, payload);
}
