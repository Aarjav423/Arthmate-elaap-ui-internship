import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function updateProductDueConfigApi(payload) {
  return axios.put(BASE_URL + "product_dues", payload);
}
