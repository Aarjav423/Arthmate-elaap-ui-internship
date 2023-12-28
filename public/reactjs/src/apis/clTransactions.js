import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';
import { storedList } from "../util/localstorage";

export function GetLoanDataApi(payload) {
    return axios.post(`${BASE_URL}loan/${payload.loan_id}`, payload);
};

export function AddLoanTransactionApi(payload) {
    return axios.post(BASE_URL + "cl_record", payload);
};

export function getDisbursmentDataApi(payload) {
    const user = storedList("user") ? storedList("user") : { id: null };
    payload.user_id = user._id;
    return axios.post(BASE_URL + "disbursement_record", payload);
};