import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getFosUsersApi(payload) {
  return axios.get(`${BASE_URL}collection/users`, {
    params: payload
  });
}

export function getFosUserApi(userId) {
  return axios.get(`${BASE_URL}collection/users/${userId}`);
}

export function addFosUserApi(payload) {
  return axios.post(`${BASE_URL}collection/user`, payload);
}

export function updateFosUserApi(payload) {
  return axios.patch(`${BASE_URL}collection/user/${payload.userId}`, payload);
}

