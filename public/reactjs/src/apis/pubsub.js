import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

/* broadcase event master API's */
export function createBroadcastEventApi(payload) {
  return axios.post(BASE_URL + "broadcast_event", payload);
}

export function getBroadcastEventByCompanyIdApi(payload) {
  return axios.get(`${BASE_URL}${"broadcast_event"}/`);
}

export function updateBroadcastEventApi(payload) {
  return axios.put(`${BASE_URL}${"broadcast_event"}/${payload.id}`, payload);
}

export function updateBroadcastStatusEventApi(payload) {
  return axios.put(
    `${BASE_URL}${"broadcast_event"}/${payload.id}/${payload.status}`,
    payload
  );
}

/* subscription event API's */

export function createSubscriptionEventApi(payload) {
  return axios.post(BASE_URL + "subscribe_event", payload);
}

export function getSubscriptionEventByCompanyIdApi(payload) {
  return axios.get(`${BASE_URL}${"subscribe_event"}/${payload.id}`);
}

export function updateSubscriptionEventApi(payload) {
  return axios.put(`${BASE_URL}${"subscribe_event"}/${payload.id}`, payload);
}

