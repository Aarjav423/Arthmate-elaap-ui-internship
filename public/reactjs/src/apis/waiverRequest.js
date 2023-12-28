import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function createWaiverRequestApi(payload) {
  return axios.post(BASE_URL + "waiver_request", payload);
}

export function getWaiverRequestDetailsApi(payload) {
  return axios.get(
    `${BASE_URL}waiver_request/${payload.loan_id}/${payload.company_id}/${payload.product_id}/${payload.user_id}`
  );
}

export function getWaiverRequestDetailsByLoanApi(payload) {
  return axios.get(
    `${BASE_URL}waiver_request_loan/${payload.loan_id}/${payload.company_id}/${payload.product_id}/${payload.user_id}/${payload.loan_id}`
  );
}

export function getWaiverRequestDetailsByReqIdApi(payload) {
  return axios.get(
    `${BASE_URL}waiver-request-details/${payload.loan_id}/${payload.sr_req_id}/${payload.company_id}/${payload.product_id}/${payload.user_id}`
  );
}

export function updateWaiverRequestStatusApi(payload) {
  return axios.post(`${BASE_URL}waiver-request-status-update`, payload);
}
