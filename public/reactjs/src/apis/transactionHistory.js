import axios from "axios";
import { storedList } from "../util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function transactionHistoryListApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}transaction_history_list/${payload.loan_id}`, payload
  );
}


export function drawDownRequestListApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}loc-drawdown-request/${payload.loan_id}/${payload.page}/${payload.limit}`, payload
  );
}

export function drawDownRequestDetailsApi(payload) {
  return axios.post(
    `${BASE_URL}loc-drawdown-request/${payload.loan_id}/${payload.request_id}`, payload
  );
}

export function rejectDrawDownRequestApi(payload) {
  return axios.put(
    `${BASE_URL}reject-record-drawdown-request`, payload
  );
}
