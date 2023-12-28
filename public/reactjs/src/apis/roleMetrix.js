import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function fetchRoleMetrix(payload) {
  return axios.get(BASE_URL + `access_metrix/${payload.page}/${payload.limit}`);
}

export function addDesignation(payload) {
  return axios.post(BASE_URL + "designation", payload);
}

export function addDepartment(payload) {
  return axios.post(BASE_URL + "department", payload);
}

export function addRole(payload) {
  return axios.post(BASE_URL + "role", payload);
}

export function fetchRole(payload) {
  return axios.get(BASE_URL + "role", payload);
}

export function fetchDepartment(payload) {
  return axios.get(BASE_URL + "department", payload);
}

export function fetchDesignation(payload) {
  return axios.get(BASE_URL + "designation", payload);
}


export function updateRoleAPI(payload) {
  return axios.put(BASE_URL + `role/${payload.id}`,payload);
}
