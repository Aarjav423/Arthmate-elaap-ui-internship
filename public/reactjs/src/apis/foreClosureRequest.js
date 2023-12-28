import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';

export function getForeClosureLoanApi(payload) {
  return axios.get(BASE_URL + `v2/foreclosure-request/${payload.loan_id}/${payload.company_id}/${payload.product_id}`, {
    params: {
      companyData: {
        companyId: payload.company_id,
        productId: payload.product_id,
        loanId: payload.loan_id,
      },
    },
  });
}
export function addForeClosureLoanApi(payload) {
  return axios.post(BASE_URL + `v2/foreclosure-request/${payload?.companyData?.loan_id}`, payload);
}

export function getForeClosureRequestDetail(payload) {
  return axios.get(`${BASE_URL}v2/foreclosure-offer-request/${payload.loan_id}/${payload.company_id}/${payload.product_id}/${payload.request_id}/${payload.user_id}`);
}

export function updateForeClosureRequestStatus(payload) {
  return axios.post(`${BASE_URL}v2/foreclosure-request/conclusion/${payload.loan_id}/${payload.company_id}/${payload.product_id}/${payload.approver_id}`, payload);
}

export function getForeClosureOfferRequestDetail(payload) {
  return axios.get(`${BASE_URL}v2/foreclosure-offers-requests/${payload.loan_id}/${payload.company_id}/${payload.product_id}/${payload.user_id}/${payload.page}/${payload.limit}`);
}

export function getForceCloseLoanApi(payload) {
  return axios.get(BASE_URL + `v2/force-close/${payload.company_id}/${payload.product_id}/${payload.loan_id}`);
}

export function addForceCloseLoanApi(payload) {
  return axios.post(BASE_URL + `v2/force-close/${payload.company_id}/${payload.product_id}/${payload.loan_id}`, payload);
}
