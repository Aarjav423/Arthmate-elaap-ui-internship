import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getAccessMetrixAPI(payload) {
  return axios.get(`${BASE_URL}access_metrix/${payload.page}/${payload.limit}`);
}

export function addAccessMetrixAPI(payload) {
  return axios.post(BASE_URL + "access_metrix", payload);
}

export function updateAccessMetrixAPI(payload) {
  return axios.put(BASE_URL + "access_metrix", payload);
}
