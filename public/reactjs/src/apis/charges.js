import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

export function getChargeTypesAPI(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  const user_id = user._id;
  return axios.get(BASE_URL + `charge-types/${user_id}`);
}

export function applychargeAPI(payload) {
  return axios.post(BASE_URL + `apply-charge`, payload);
}

export function getChargeAPI(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + `charges`, payload);
}
