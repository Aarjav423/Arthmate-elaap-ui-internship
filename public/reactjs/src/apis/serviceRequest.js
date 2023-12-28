import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { putServiceRequestActionEffectSaga } from "../sagas/serviceRequest";

export function getServiceRequestApi(payload) {
  return axios.post(
    `${BASE_URL}foreclosure-requests/${payload.user_id}/${payload.company_id}/${payload.product_id}/${payload.request_type}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function getForeclosureOfferRequestApi(payload) {
  return axios.post(
    `${BASE_URL}foreclosure-offer-requests/${payload.user_id}/${payload.company_id}/${payload.product_id}/${payload.requestStatus}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function getWaiverRequestApi(payload) {
  return axios.post(
    `${BASE_URL}waiver-requests/${payload.user_id}/${payload.company_id}/${payload.product_id}/${payload.requestStatus}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function getWaiverRequestLoanApi(payload) {
  return axios.post(
    `${BASE_URL}waiver-requests-loan/${payload.user_id}/${payload.company_id}/${payload.product_id}/${payload.requestStatus}/${payload.page}/${payload.limit}/${payload.loan_id}`,
    payload
  );
}

export function putServiceRequestActionApi(payload) {
  return axios.put(
    `${BASE_URL}foreclosure-approve/${payload.loan_id}/${payload.id}/${payload.sr_req_id}/${payload.is_approved}`,
    payload
  );
}
