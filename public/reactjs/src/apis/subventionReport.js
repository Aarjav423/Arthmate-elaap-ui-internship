import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getSubventionReportsAPI(payload) {
  return axios.post(
    BASE_URL + `subvention-invoice-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateSubventionReportAPI(payload) {
  return axios.post(BASE_URL + "subvention-invoice-report", payload);
}

export function downloadSubventionReportAPI(payload) {
  return axios.post(
    BASE_URL + `download-subvention-invoice-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
