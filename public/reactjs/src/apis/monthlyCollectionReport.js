import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getMonthlyCollectionReportsAPI(payload) {
  return axios.post(
    BASE_URL +
      `monthly-collection-report/${payload.month}/${payload.year}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadMonthlyCollectionReportAPI(payload) {
  return axios.post(
    BASE_URL +
      `download-monthly-collection-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

export function getServiceUsageReportsAPI(payload) {
  return axios.post(
    BASE_URL + `service-usage-report/${payload.month}/${payload.year}/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadServiceUsageAPI(payload) {
  return axios.post(
    BASE_URL +
    `download-service-usage-report/${payload?.submitData.id}/${payload?.userData.user_id}`,payload,{responseType:"arraybuffer"}
  );
}
