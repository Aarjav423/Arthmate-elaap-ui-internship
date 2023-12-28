import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getCollectionBankDetailsApi() {
  return axios.get(BASE_URL + "collection-bank-details");
}