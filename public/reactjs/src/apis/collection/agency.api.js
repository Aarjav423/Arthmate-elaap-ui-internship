import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getAgenciesApi(payload) {
  return axios.get(`${BASE_URL}collection/agencies`, { params: payload });
}

export function createCollectionAgencyAPI(payload){
  return axios.post(`${BASE_URL}collection/agency`, payload);
}

export function updateCollectionAgencyAPI(payload){
  const {agencyId, ...otherPayload} = payload
  return axios.patch(`${BASE_URL}collection/agency/${agencyId}`, otherPayload);
}
