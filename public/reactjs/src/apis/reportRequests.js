import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getReportRequests(payload) {
  return axios.post(
    BASE_URL + `report-request/${payload.report_name}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateReportRequest(payload) {
  return axios.post(
    BASE_URL + "report-request",
    payload
  );
}

export function downloadReportRequestFile(payload) {
  return axios.post(
    BASE_URL + `report-request/download/${payload.request_id}`,
    payload
  );
}
