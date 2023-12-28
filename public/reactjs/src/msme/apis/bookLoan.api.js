import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";
import { storedList } from "../../util/localstorage";

export function createLoanIDApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "msme/lead", payload);
}

export function updateLoanIDApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };

  payload.user = user;
  return axios.patch(BASE_URL + `msme/lead/${payload.loan_app_id}`, payload);
}

export function getBookLoanAPI(payload) {
  //const user = storedList("user") ? storedList("user") : { id: null };
  return axios.get(BASE_URL + "msme/lead/" + payload.loan_app_id, {
    params: payload,
  });
}

export function postLoanDetailsApi(payload) {
  return axios.post(`${BASE_URL}msme/loan`, payload);
}


export function getMsmeLoanDocumentsApi(payload) {
  return axios.get(`${BASE_URL}msme/lead/${payload.loanAppID}/document`, {
    params: payload,
  });
}

export function getGstStatusIDApi(payload){
  return axios.post(`${BASE_URL}msme/lead/gstin/${payload.loan_app_id}`, payload);
}
