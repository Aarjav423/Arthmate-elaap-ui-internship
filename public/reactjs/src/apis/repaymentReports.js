import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getRepaymentReportsAPI(payload) {
  return axios.post(
    BASE_URL + `repayment_reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateRepaymentReportAPI(payload) {
  return axios.post(BASE_URL + "repayment-report", payload);
}

export function downloadRepaymentReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-repayment-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
