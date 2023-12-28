import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';

export function getRefundDetails(payload) {
  return axios.post(`${BASE_URL}refund-details/${payload.loan_id}`, payload);
}

export function initiateRefundApi(payload) {
  return axios.post(`${BASE_URL}initiate-interest-refund`, payload);
}

export function initiateExcessRefundApi(payload) {
  return axios.post(`${BASE_URL}initiate-excess-refund`, payload);
}
