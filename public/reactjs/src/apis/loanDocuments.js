import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getLoanDocsApi(payload) {
  return axios.post(`${BASE_URL}loandocument/${payload.loan_app_id}`, payload);
}

export function getProductDetailsApi(payload) {
  return axios.get(`${BASE_URL}product/${payload.product_id}`, {id:payload.product_id});
}

export function getDocDetailsApi(payload) {
  return axios.get(`${BASE_URL}loan-document-mapping`);
}

export function uploadLoanDocumentsApi(payload) {
  return axios.post(`${BASE_URL}loan_documents`, payload);
}

export function uploadLoanDocumentsXmlJsonApi(payload) {
  return axios.post(`${BASE_URL}kyc/loan_document/parser`, payload);
}

export function viewDocsApi(payload) {
  return axios.post(BASE_URL + "view_doc", payload);
}

// API to upload drawdown document
export function uploadDrawDownDocumentsApi(payload) {
  return axios.post(`${BASE_URL}drawdown_document`, payload)
}

//API fetch all the drawdown documents
export function getDrawDownDocsApi(payload) {
  return axios.post(`${BASE_URL}drawdown_document/${payload.loan_app_id}`, payload);
}

export function getLoanDocumentsApi(payload) {
  return axios.get(`${BASE_URL}loandocument`, { params: payload });
}