import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getSettlementetails(payload) {
  return axios.get(`${BASE_URL}settlement-request/${payload.loan_id}/${payload.company_id}/${payload.product_id}/${payload.user_id}/${payload.page}/${payload.limit}` , 
  payload);
}
