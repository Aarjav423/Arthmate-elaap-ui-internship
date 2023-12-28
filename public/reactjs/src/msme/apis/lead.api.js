import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getMsmeLeadReviewDetailsApi(payload) {
  return axios.get(`${BASE_URL}msme/lead/${payload.loanAppId}/review`, {
    params: payload,
  });
}

export function updateLeadDetailsApi(payload) {
  return axios.put(
    `${BASE_URL}msme/lead/${payload.loanAppId}/status_update/${payload.status}`,
    payload
  );
}

export function getMsmeActivityLogsApi(payload) {
  return axios.get(`${BASE_URL}msme/activity-logs/${payload.loanAppId}`, {
    params: payload,
  });
}
export function commentdetailsApi(payload) {
  return axios.post(`${BASE_URL}msme/add-comment`, payload);
}

export function getLeadStatusApi(payload) {
  return axios.get(`${BASE_URL}msme/lead/${payload.loan_app_id}/section`, {
    params: payload,
  });
}

export function getLeadOfferApi(payload) {
  return axios.post(`${BASE_URL}msme/lead/${payload.loan_app_id}/offer`, {payload});
}

export function getCalculateFeesAndChargesWatcherApi(payload) {
  return axios.post(`${BASE_URL}msme/loan/calculateFeesAndCharges`, payload);
}

export function postAadhaarOtpApi(payload) {
  return axios.post(`${BASE_URL}msme/leads/okyc-aadhar-otp`, {payload});
}

export function createMsmeActivityLogApi(payload) {
  return axios.post(`${BASE_URL}msme/activity-logs`, payload);
}
