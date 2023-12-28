import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function calculateInsurancePremiumApi(payload) {
  return axios.post(BASE_URL + "calculate-insurance-premium", payload);
}
