import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getAScoreDataAPI(payload) {
  return axios.post(`${BASE_URL}aScore-data/${payload?.loan_app_id}`, payload);
}

export function updateAScoreDataAPI(payload) {
  return axios.post(`${BASE_URL}aScore-data`, payload);
}
