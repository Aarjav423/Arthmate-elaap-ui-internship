import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getDPDReportsAPI(payload) {
  return axios.post(
    BASE_URL + `dpd-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateDPDReportAPI(payload) {
  return axios.post(BASE_URL + "dpd-report", payload);
}

export function downloadDPDReportAPI(payload) {
  return axios.post(
    BASE_URL + `download-dpd-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
