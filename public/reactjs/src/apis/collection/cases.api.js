import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getCollectionCasesApi(payload) {
  return axios.get(`${BASE_URL}collection/cases`, { params: payload });
}

export function getCollectionCaseByIdApi(payload) {
  return axios.get(`${BASE_URL}collection/cases/${payload.collectionId}`);
}

export function assignCollectionCasesApi(payload) {
  return axios.post(`${BASE_URL}collection/assign-cases`, payload);
}

export function deAssignCollectionCasesApi(payload) {
  return axios.post(`${BASE_URL}collection/deassign-cases`, payload);
}

export function getCaseSourcingPartnerApi(payload) {
  return axios.get(`${BASE_URL}collection/cases/companies`, {
    params: payload,
  });
}

export function getCaseCollHistoryByIdApi(payload) {
  return axios.get(`${BASE_URL}collection/cases/history/${payload.collId}`, {
    params: payload,
  });
}

export function getCaseCollPaymentDataByIdApi(payload) {
  return axios.get(`${BASE_URL}collection/cases/payment/${payload.caseId}`, {
    params: payload,
  });
}

export function getCollectionCasesAssignApi(payload) {
  return axios.get(`${BASE_URL}collection/cases/assigned`, payload);
}

export function getCollectionCaseLmsIdApi(payload) {
  return axios.get(`${BASE_URL}collection/cases/lms-id`, { params: payload });
}

export function getCollectionCaseCollIdsApi(payload) {
  return axios.post(`${BASE_URL}collection/cases/coll-id`, payload);
}

export function getCollectionCaseSelectedApi(payload) {
  return axios.post(`${BASE_URL}collection/cases/select`, payload);
}

export function viewLoanDocumentLogsApi(payload) {
  return axios.post(`${BASE_URL}collection/cases/logs/view-document`, payload);
}
