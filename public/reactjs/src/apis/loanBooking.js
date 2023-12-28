import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function fetchLoanschemaCustomeIdApi(payload) {
  return axios.post(BASE_URL + "fetch_loan_template_data", payload);
}

export function getAllLoanBookingTemplateApi(payload) {
  return axios.post(BASE_URL + "get_loan_template_product_wise", payload);
}
