import axios from "axios";
import { storedList } from "../util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function repaymentV2FormPostApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  payload.created_by = user.username;
  return axios.post(
    `${BASE_URL}repayment-record-v2`, payload
  );
}
