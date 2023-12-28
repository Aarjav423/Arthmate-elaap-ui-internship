import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getReconDetails(payload) {
  return axios.post(`${BASE_URL}recon-details/${payload.user_id}/${payload.loan_id}` , payload);
}
