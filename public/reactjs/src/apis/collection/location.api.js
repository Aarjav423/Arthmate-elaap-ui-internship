import axios from "axios";
import {BASE_URL} from "../../constants/apiUrls";

export function getLocationPincodesApi(params) {
  return axios.get(`${BASE_URL}collection/location/pincodes`,{
    params: params
  });
}

