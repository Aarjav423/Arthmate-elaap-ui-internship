import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

export function addPartnerApi(payload) {
  return axios.post(BASE_URL + "partner", payload);
}
export function partnerListApi(payload) {
  return axios.post(BASE_URL + "partner-list", payload);
}
export function viewPartnerDetailsApi(payload) {
  return axios.get(BASE_URL + `partner/${payload.partner_id}`);
}

export function viewPartDocsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "viewpartnerdocument", payload);
}
export function uploadPartDocsApi(payload) {
  return axios.post(BASE_URL + "partnerdocument", payload);
}

export function fetchPartDocsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "fetchpartnerdocument", payload);
}
