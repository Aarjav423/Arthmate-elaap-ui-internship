import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getEmiData(payload) {
  return axios.post(
    `${BASE_URL}emi-data/${payload.company_id}/${payload.product_id}/${payload.page}/${payload.limit}/${payload.status}/${payload.fromRange}/${payload.toRange}/${payload.searchBy}`
  );
}

export function submitForNachPresentation(payload) {
  return axios.post(`${BASE_URL}nach-presentation`, payload);
}

export function getNachDetailsApi(payload) {
  return axios.post(`${BASE_URL}enach-details`, payload);
}

export function getNachHoldRegistrationApi(payload) {
  return axios.post(`${BASE_URL}nach-suspend-registration`, payload);
}

export function getNachRevokeRegistrationApi(payload) {
  return axios.post(`${BASE_URL}nach-revoke-suspend-registration`, payload);
}

export function createSubscriptionApi(payload) {
  return axios.post(`${BASE_URL}create-subscription`, payload);
}  
export function getNachMandatePurpose(payload) {
  return axios.post(`${BASE_URL}enach-purpose`, payload);
}  
export function getSingleNachDetailApi(payload) {
  return axios.post(`${BASE_URL}enach-detail-by-requestId`, payload);
}

export function getNachTransactionDetailApi(payload) {
  return axios.post(`${BASE_URL}enach-transaction-details`, payload);
}

export function postNachCreatePresentmentApi(payload) {
  return axios.post(`${BASE_URL}enach-create-presentment`, payload);
}

export function getNachGeneratedTokenApi(payload) {
  return axios.post(`${BASE_URL}enach-get-generated-token`, payload);
}

export function cancelNachRegistrationApi(payload) {
  return axios.post(`${BASE_URL}nach-cancel-registration`, payload);
}

export function getNachLiveBankDetailsApi(payload) {
  return axios.post(`${BASE_URL}nach-live-bank-status`, payload);
}

export function getLoanDetailsNachApi(payload) {
  return axios.post(`${BASE_URL}loan-details-nach`, payload);
}
