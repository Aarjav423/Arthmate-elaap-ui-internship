import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getBulkUploadDataApi(payload) {
  return axios.post(`${BASE_URL}get-bulk-upload-data`, payload);
}

export function uploadBulkFileApi(payload) {
  return axios.post(`${BASE_URL}upload-bulk-file`, payload);
}

export function downloadBulkUploadFileApi(payload) {
  return axios.post(`${BASE_URL}download-bulk-upload-file/${payload.id}`, payload);
}