import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function validationListApi(payload) {
  return axios.get(BASE_URL + "validation-checks", payload);
}
