import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getInsurancePolicyAPI(payload) {
  return axios.post(BASE_URL + "insurance-policy", payload);
}
