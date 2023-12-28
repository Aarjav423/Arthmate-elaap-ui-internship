import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function submitCamsDetailsAPI(payload) {
  return axios.post(BASE_URL + `cams-details/${payload?.loan_app_id}`, payload);
}

export function getCamsDetailsAPI(payload) {
  return axios.get(BASE_URL + `cams-details/${payload?.loan_app_id}`);
}

export function getBreDetailsAPI(payload) {
  return axios.post(BASE_URL + `fetch-bre-details`, payload);
}

export function runCreditEngineAPI(payload) {
  return axios.put(BASE_URL + `run-credit-engine`, payload);
}

export function updateCamsDetailsAPI(payload) {
  return axios.put(BASE_URL + `cams-details/${payload?.loan_app_id}`, payload);
}

export function getSelectorDetailsAPI(payload) {
  return axios.post(BASE_URL + `lead/${payload?.loan_app_id}`, payload);
}

export function getSelectorDetailsDataAPI(payload) {
  return axios.get(BASE_URL + `selector-basic-details/${payload?.loan_app_id}`);
}

export function postSelectorDetailsAPI(payload) {
  return axios.post(BASE_URL + `selector-details`, payload);
}

export function postSelectorColenderDetailsAPI(payload) {
  return axios.post(BASE_URL + `selector-response`, payload);
}

export function getUdhyamRegistrationDetailsAPI(payload) {
  return axios.post(
    BASE_URL + `udhyam-aadhar-OCR-data/${payload?.loan_app_id}`,
    payload
  );
}

export function getCamsDataApi(payload) {
  return axios.get(
    BASE_URL + `msme/leads/cams/${payload.loan_app_id}`, { params: payload }
  );
}

export function updateCamsDataAPi(payload) {
  return axios.patch(BASE_URL + `msme/leads/cams/${payload.loan_app_id}`, payload);
}

export function getCamDetailsAPI(payload) {
  return axios.get(BASE_URL + `cam-details/${payload?.loan_app_id}`);
}