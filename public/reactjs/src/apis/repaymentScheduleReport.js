import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getRepaymentScheduleReportsAPI(payload) {
  return axios.post(
    BASE_URL + `repayment_schedule_reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateRepaymentScheduleReportAPI(payload) {
  return axios.post(BASE_URL + "repayment-schedule-report", payload);
}

export function downloadRepaymentScheduleReportAPI(payload) {
  return axios.get(
    BASE_URL +
    `download-repayment-schedule-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
