import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';

export function getForceCancelLoanApi(payload) {
  return axios.get(BASE_URL + `force-cancel/${payload.company_id}/${payload.product_id}/${payload.loan_id}`);
}

export function postForceCancelLoanApi(payload) {
  return axios.post(BASE_URL + `force-cancel/${payload.company_id}/${payload.product_id}/${payload.loan_id}`, payload);
}