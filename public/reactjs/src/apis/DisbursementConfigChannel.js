import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function addDisburseConfigChannelApi(payload) {
  return axios.post(BASE_URL + "disbursement-config", payload);
}

export function addColenderDisburseConfigChannelApi(payload) {
  return axios.post(BASE_URL + "colender-disbursement-config", payload);
}

export function getAllDisburseConfigChannelApi(payload) {
  return axios.post(BASE_URL + "disbursement_config_list", payload);
}

export function getDisburseConfigChannelBy_CID_PIDApi(payload) {
  return axios.get(
    `${BASE_URL}disbursement-channel-config/${payload.company_id}/${payload.product_id}`
  );
}

export function updateDisburseConfigChannelApi(payload) {
  return axios.put(BASE_URL + "disbursement-config", payload);
}

export function updateDisburseConfigChannelStatusApi(payload) {
  return axios.put(BASE_URL + "disbursement-config/status", payload);
}

export function deleteDisburseConfigChannelByIdApi(payload) {
  return axios.post(
    BASE_URL + "disbursement-config/" + `${payload._id}`,
    payload
  );
}
