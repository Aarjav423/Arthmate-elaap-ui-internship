import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

/* Product Type API's */

export function accountHolderListApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    BASE_URL + `bank-details/${payload.page}/${payload.limit}/${payload?.search || "null"}`,
    payload
  );
}

export function addAccountHolderApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    BASE_URL + "bank-details",
    payload
  );
}

export function editAccountHolderApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.put(
    BASE_URL + "bank-details",
    payload
  );
}


