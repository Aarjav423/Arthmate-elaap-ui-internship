import axios from "axios";
import { storedList } from "../util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function repaymentFormPostApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}repayment_record`, payload
  );
}
