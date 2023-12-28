import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getLeadSectionStatusApi(payload) {
  return axios.post(`${BASE_URL}msme/leads/section-status`, payload)
}
