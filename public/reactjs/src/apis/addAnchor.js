import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

export function addAnchorApi(payload) {
  return axios.post(BASE_URL + "anchor", payload);
}
export function anchorListApi(payload) {
  return axios.post(BASE_URL + "anchor-list", payload);
}
export function viewAnchorDetailsApi(payload) {
  return axios.get(BASE_URL + `anchor/${payload.anchor_id}`);
}

export function viewAnchorDocsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "viewanchordocument", payload);
}
export function uploadAnchorDocsApi(payload) {
  return axios.post(BASE_URL + "anchordocument", payload);
}

export function fetchAnchorDocsApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "fetchanchordocument", payload);
}
