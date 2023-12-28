import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getCoLenderTokenApi(payload) {
  return axios.post(BASE_URL + "co_lender_token", payload);
}