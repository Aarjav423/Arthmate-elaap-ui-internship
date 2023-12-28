import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function loginApi(payload) {
  return axios.post(BASE_URL + "login", payload);
}

export function createUserApi(payload) {
  return axios.post(BASE_URL + "user", payload);
}

export function userListApi(payload) {
  return axios.get(BASE_URL + "user", payload);
}

export function toggleUserStatusApi(payload) {
  return axios.put(BASE_URL + "user", payload);
}

export function updateUserAPI(payload) {
  return axios.put(BASE_URL + `user/${payload.id}`, payload);
}

export function resetPasswordAPI(payload) {
  return axios.post(BASE_URL + `resetpassword`, payload);
}

export function searchUserAPI(payload) {
  return axios.post(BASE_URL + `usersearch`, payload);
}
