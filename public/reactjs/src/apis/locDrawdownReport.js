import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getLocDrawdownReports(payload) {
  return axios.post(
    BASE_URL + `loc-drawdown-reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateLocDrawdownReport(payload) {
  return axios.post(BASE_URL + "loc-drawdown-report", payload);
}

export function downloadLocDrawdownReport(payload) {
  return axios.get(
    BASE_URL + `download-loc-drawdown-reports/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
