import axios from "axios";
import { storedList } from "../util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function repaymentScheduleFormPostApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(`${BASE_URL}repayment_schedule`, payload);
}

export function repaymentScheduleListApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}repayment_schedule/${payload.loan_id}`,
    payload
  );
}

export function repaymentScheduleForLocApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}loc-repayment-schedule/${payload.loan_id}`,
    payload
  );
}

export function repaymentScheduleRaiseDueApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}repayment-schedules/${payload.loan_id}/dues/${payload.emi_no}/`,
    payload
  );
}
