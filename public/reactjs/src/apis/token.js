import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getAllTokenAPI() {
  return axios.get(BASE_URL + "token");
}

export function getTokenByCompanyApi(payload) {
  return axios.get(
    BASE_URL + `token/${payload.company_id}/${payload.product_id}/${payload.co_lender_id}`,
    payload
  );
}

export function updateTokenByIdApi(payload) {
  return axios.put(BASE_URL + "token/" + `${payload.id}`, payload);
}

//Update token status
export function updateTokenStatusApi(payload) {
  return axios.put(BASE_URL + "token_status", payload);
}

export function deleteTokenByIdApi(payload) {
  return axios.post(BASE_URL + "token_delete", payload);
}
