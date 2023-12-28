import axios from "axios";
import { storedList } from "../util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function getCustomerDataApi(payload) {
    const user = storedList("user");
    return axios.post(`${BASE_URL}customer/${user._id||null}`,payload);
  }

export function getCustomerDocsApi(payload) {
    return axios.get(`${BASE_URL}customer-document/${payload.customer_id}/${payload.user_id}`);
}

export function viewCustomerDocsApi(payload) {
  return axios.post(BASE_URL + "view_customer_doc", payload);
}

export function getCustomerDetailsApi(payload) {
    const user=storedList("user");
    return axios.get(`${BASE_URL}customer-details/${payload.customer_id}/${user._id}`)
}