import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function setCreditLimit(payload) {
  return axios.post(BASE_URL + `credit-limit`, payload);
}

export function updateCreditLimit(payload) {
  return axios.put(BASE_URL + `credit-limit`, payload);
}
