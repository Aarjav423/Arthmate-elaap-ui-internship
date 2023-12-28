import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getAllDisburseChannelMasterApi(payload) {
  return axios.get(BASE_URL + "disbursement-channel-master");
}
