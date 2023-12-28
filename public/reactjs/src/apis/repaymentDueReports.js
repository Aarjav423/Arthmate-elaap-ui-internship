import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getRepaymentDueReportsAPI(payload) {
  return axios.post(
    BASE_URL + `repayment_due_reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateRepaymentDueReportAPI(payload) {
  return axios.post(BASE_URL + "repayment-due-report", payload);
}

export function downloadRepaymentDueReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-repayment-due-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
