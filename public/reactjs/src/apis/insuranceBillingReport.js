import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getMonthlyInsuranceBillingReportsAPI(payload) {
  return axios.post(
    BASE_URL + `insurance-billing-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateMonthlyInsuranceBillingReportAPI(payload) {
  return axios.post(BASE_URL + "insurance-billing-report", payload);
}

export function downloadMonthlyInsuranceBillingReportAPI(payload) {
  return axios.post(
    BASE_URL +
      `download-insurance-billing-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
