import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

// calling internal api to get all ckyc reports lists on reports page
export function getCkycReportsAPI(payload) {
  return axios.post(
    BASE_URL + `ckyc_report/${payload.page}/${payload.limit}`,
    payload
  );
}

// calling internal api to generate ckyc reports entry on reports page
export function generateCkycReportAPI(payload) {
  return axios.post(BASE_URL + "ckyc_report", payload);
}

// calling internal api to download ckyc zip file when clicking on download icon
export function downloadCkycReportAPI(payload) {
  return axios.get(
    BASE_URL +
    `download_ckyc_report/${payload?.submitData.id}/${payload?.userData.user_id}`,{responseType:"arraybuffer"}
  );
}

//this api is used to upload ckyc txt file
export function ckycUploadApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "ckyc-file-dump", payload);
}

//this api is used to get uploaded ckyc txt file
export function getckycTextFilesApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.get(`${BASE_URL}ckyc-file-details`, payload);
}

//this api is used to get uploaded ckyc txt file
export function downloadckycTextFilesApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.get(`${BASE_URL}download-processed-ckyc-files/${payload?.id}/${user._id}`, {responseType:"blob"});
}
