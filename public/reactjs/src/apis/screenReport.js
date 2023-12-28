import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";


// calling internal api to get all screen reports lists on reports page
export function getScreenReportsAPI(payload) {
  return axios.get(
    BASE_URL + `screen-reports/${payload.page}/${payload.limit}`,
    payload
  );
}

// calling internal api to generate screen reports entry on reports page
export function generateScreenReportAPI(payload) {
  return axios.post(BASE_URL + "screen-report", payload);
}

// calling internal api to download screen zip file when clicking on download icon
export function downloadScreenReportAPI(payload) {
  return axios.get(
    BASE_URL +
    `download-screen-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
