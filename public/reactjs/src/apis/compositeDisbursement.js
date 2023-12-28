import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

export const addDisbursementChannelApi = payload => {
  return axios.post(BASE_URL + "topup-disbursement-channel", payload);
};

export const deleteDisbursementChannelApi = payload => {
  return axios.post(
    BASE_URL + `disbursement-channel-master/delete/${payload.submitData.id}`,
    payload
  );
};

export const updateDisbursementChannelApi = payload => {
  return axios.put(
    BASE_URL + `disbursement-channel-master/${payload.submitData.id}`,
    payload
  );
};

export const getAllDisburseConfigChannelApi = payload => {
  return axios.post(BASE_URL + "disbursement-channel-master", payload);
};

export const onboardDisbursementChannelApi = payload => {
  return axios.post(BASE_URL + "disbursement-channel-master/add", payload);
};

export const compositeDisbursementAPI = payload => {
  return axios.post(BASE_URL + "composite_disbursement", payload);
};

export const processDrawdownAPI = payload => {
  return axios.post(BASE_URL + "process-drawdown-pf", payload);
};

export const getLoanByStatusAPI = payload => {
  return axios.post(BASE_URL + "get-loans-by-status", payload);
};

export const getLoanByStatusApiForLoc = payload => {
  return axios.post(BASE_URL + "unprocessed-requests", payload);
};

export const compositeDrawdownApi = payload => {
  return axios.post(BASE_URL + "composite_drawdown", payload);
};

export const batchDisbursementApi = payload => {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.userData.user_id = user._id;
  return axios.post(BASE_URL + "record-drawdown-request", payload);
};

export const fetchBankDetailsApi = payload => {
  return axios.post(
    `${BASE_URL}bank-details/${payload.page}/${payload.limit}?search=${payload.search}&status=${payload.status}`,
    payload
  );
};

export const fetchSchemeDetailsApi = payload => {
  return axios.post(
    `${BASE_URL}product-schemes/${payload.page}/${payload.limit}?product_id=${payload.product_id}&scheme_id=${payload.scheme_id}&status=${payload.status}`,
    payload
  );
};

export const updateDrawdownRequestApi = payload => {
  return axios.put(BASE_URL + "update-record-drawdown-request", payload);
};

export const calculateNetDrawDownAmountApi = payload => {
  return axios.post(BASE_URL + "calculate-net-drawdown-amount", payload);
};