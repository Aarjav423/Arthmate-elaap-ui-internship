import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';
import { storedList } from '../util/localstorage';

export function postTDSRefundRequestApi(payload) {
  const user = storedList('user') ? storedList('user') : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + 'tds_refund', payload);
}
