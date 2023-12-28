import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "util/localstorage";

export function getAllProductRequest(payload) {
  return axios.get(`${BASE_URL}product-scheme/products/all`, payload);
}

export function getAllActiveProductRequest(payload) {
  return axios.get(`${BASE_URL}product-scheme/active`, payload);
}

export function getAllProductSchemeMapping(payload) {
  if (payload.product_id && payload.scheme_id) {
    return axios.get(
      `${BASE_URL}product-scheme/${payload.product_id}/${payload.scheme_id}/${payload.page}/${payload.limit}`,
      payload
    );
  } else if (payload.product_id) {
    return axios.get(
      `${BASE_URL}product-scheme/${payload.product_id}/${payload.page}/${payload.limit}`,
      payload
    );
  } else {
    return axios.get(
      `${BASE_URL}product-scheme/${payload.page}/${payload.limit}`,
      payload
    );
  }
}

export function getAllProductScheme(payload) {
  const user_id = storedList("user") ? storedList("user") : { id: null };
  return axios.get(
    `${BASE_URL}product-scheme/scheme/${payload.product_id}/${user_id._id}`,
    payload
  );
}

export function toggleProductSchemeStatusApi(payload) {
  const user_id = storedList("user") ? storedList("user") : { id: null };
  return axios.put(
    `${BASE_URL}product-scheme/${payload.product_id}/${payload.id}/${user_id._id}`,
    payload
  );
}

export function getAllSchemeListApi(payload) {
  return axios.get(`${BASE_URL}scheme/0/1000`, payload);
}

export function productSchemeMappedApi(payload) {
  const user_id = storedList("user") ? storedList("user") : { id: null };
  return axios.post(
    `${BASE_URL}product-scheme/${payload.product_id}/${user_id._id}`,
    payload
  );
}
