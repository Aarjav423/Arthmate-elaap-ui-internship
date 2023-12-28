import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getMsmeAgenciesApi(payload) {
  return axios.get(`${BASE_URL}msme/agencies`, { params: payload });
}
