import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getDailyCollectionReportsAPI(payload) {
  return axios.post(
    BASE_URL +
      `daily-collection-report/${payload.day}/${payload.month}/${payload.year}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function getDailyLeadReportsAPI(payload) {
  return axios.post(
    BASE_URL +
      `lead-report/${payload.day}/${payload.month}/${payload.year}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function getDailyLoanReportsAPI(payload) {
  return axios.post(
    BASE_URL +
      `loan-report/${payload.day}/${payload.month}/${payload.year}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadDailyCollectionReportAPI(payload) {
  return axios.post(
    BASE_URL +
      `download-daily-collection-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

export function downloadDailyLeadReportAPI(payload) {
  return axios.post(
    BASE_URL +
      `lead-reports/${payload?.submitData.id}`,payload, {responseType: "arraybuffer"},

  );
}

export function downloadDailyLoanReportAPI(payload) {
  return axios.post(
    BASE_URL +
      `loan-reports/${payload?.submitData.id}`,payload, {responseType: "arraybuffer"}
  );
}