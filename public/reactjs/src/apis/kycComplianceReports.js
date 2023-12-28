import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getkycComplianceReportsAPI(payload) {
  return axios.post(
    BASE_URL + `kyc-compliance-reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generatekycComplianceReportAPI(payload) {
  return axios.post(BASE_URL + "kyc-compliance-report", payload);
}

export function downloadkycComplianceReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-kyc-compliance-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
