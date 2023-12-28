import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getBatchTransactionDataApi(payload) {
  return axios.post(`${BASE_URL}batch-transaction-data`, payload);
}

export function uploadPresentmentFileApi(payload) {
  return axios.post(`${BASE_URL}upload-presentment-file`, payload);
}

export function downloadPresentmentFileApi(payload) {
  console.log("api",payload);
  return axios.post(`${BASE_URL}download-presentment-file/${payload.id}`, payload);
}