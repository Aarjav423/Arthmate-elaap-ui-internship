import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

export function getBorrowerDetailApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "borrowerrecords", payload);
}

export function addBorrowerInfoSingleApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.options.user_id = user._id;
  return axios.post(BASE_URL + "borrower_info", payload);
}

export function getBorrowerDetailByIdApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  const { company_id, product_id, user_id, loan_id, loan_schema_id } = payload;
  return axios.get(
    `${BASE_URL}${"loandetails"}/${loan_id}/${company_id}/${product_id}/${user_id}/${loan_schema_id}`
  );
}

export function getAcceptBorrowerDetailByIdApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.put(BASE_URL + "borrower_info_accept", payload);
}

export function loanDisbursementApi(payload) {
  return axios.post(BASE_URL + "loan_disbursement", payload);
}

export function borrowerinfoCommonUpdatetApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.put(BASE_URL + "borrower_info", payload);
}

export function updateBorrowerInfoApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.put(BASE_URL + "borrower_info_update", payload);
}

export function updateDaApprovalApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.put(BASE_URL + "da-approval", payload);
}

export function updateBankDetailsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.patch(BASE_URL + `bank-details/${payload.loan_id}`, payload);
}

export function updateMiscDetailsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.patch(BASE_URL + `misc-details/${payload.loan_id}`, payload);
}

export function updateUMRNDetailsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.patch(BASE_URL + `loan_nach/${payload.loan_id}`, payload);
}

export function getCustomerIdApi(payload) {
  return axios.post(BASE_URL + `get-customer-id`, payload);
}

export function updateMarkRepoApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.patch(BASE_URL + `mark_repo`, payload);
}
