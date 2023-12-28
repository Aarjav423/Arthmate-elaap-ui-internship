import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getStatusChangeLogsAPI(payload) {
  return axios.post(
    BASE_URL + `status-logs/${payload.page}/${payload.loan_id}`,
    payload
  );
}
