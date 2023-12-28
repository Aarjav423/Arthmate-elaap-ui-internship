import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getTokenApi(payload) {
  return axios.post(BASE_URL + "generate_access_token", payload);
}
