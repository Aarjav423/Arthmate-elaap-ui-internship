import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function getDashboardFosSummaryApi(payloadData) {
  return axios.get(`${BASE_URL}collection/dashboard/summary`, {
    params: payloadData,
  });
}


export function getDepositionDataApi(payload) {
  return axios.get(`${BASE_URL}collection/dashboard/graph`, {
    params: payload,
  });
}


export function getDashboardCaseOverviewApi(payload) {
    return axios.get(
      `${BASE_URL}collection/dashboard/overview`,{
            params:payload
        }
    );
}

