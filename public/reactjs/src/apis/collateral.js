import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

/* broadcase event master API's */
export function getCollateralListApi(payload) {
    return axios.post(BASE_URL + "collateral/list", payload);
};

export function getCollateralByIdApi(payload) {
    return axios.post(`${BASE_URL}${"collateral_record"}/${payload?.sendData?.id}`, payload);
};

export function updateCollateralByIdApi(payload) {
    return axios.put(`${BASE_URL}${"collateral_details"}/${payload.id}`, payload);
};

export function addCollateralByIdApi(payload) {
    return axios.post(`${BASE_URL}collateral_details`, payload);
};
