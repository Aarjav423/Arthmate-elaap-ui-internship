import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getNachReportDataApi(payload) {
  return axios.post(`${BASE_URL}get-nach-report-data`, payload);
}

export function downloadNachReportFileApi(payload) {
  return axios.post(`${BASE_URL}download-nach-report-file/${payload.id}`, payload);
}