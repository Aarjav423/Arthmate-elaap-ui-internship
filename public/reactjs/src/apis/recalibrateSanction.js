import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function recalibrateSanction(payload) {
  return axios.post(`${BASE_URL}recalibrate-sanction/${payload.loan_id}`, payload);
}
