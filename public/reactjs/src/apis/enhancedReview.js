import axios from "axios";
import {
  storedList
} from "../util/localstorage";
import {
  BASE_URL
} from "../constants/apiUrls";

export function sendEnhancedReviewApi(payload) {
  const user = storedList("user") ?
    storedList("user") : {
      _id: null
    };
  payload.user_id = user._id;
  return axios.post(`${BASE_URL}send_enhanced_review`, payload);
}
