import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getTransactionDetails(payload) {
  return axios.post(`${BASE_URL}nach-transaction-details`, payload);
}

export function geteNachTransactionDetailApi(payload) {
  return axios.post(`${BASE_URL}enach-transactions-details`, payload);
}