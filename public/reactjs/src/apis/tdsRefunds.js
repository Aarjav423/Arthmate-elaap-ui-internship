import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';

export function getTdsRefundDataApi(payload) {
  let url = `${BASE_URL}refund/${payload.type}/${payload.user_id}/${payload.page}/${payload.limit}/${payload.company_id}/${payload.product_id}/${payload.financial_quarter}/${payload.status}/${payload.tds_id}/${payload.disbursement_date_time}/${payload.loan_app_date}/${payload.loan_id}`;
  return axios.get(url, {});
}

export function updateTdsRefundApi(payload) {
  return axios.patch(`${BASE_URL}update-tds-refund`, payload);
}

export function getRefundDataDetailsApi(payload) {
  return axios.get(`${BASE_URL}v2/refund-details/${payload.company_id}/${payload.product_id}/${payload.loan_id}` , payload);
}
