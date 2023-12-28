import axios from "axios";
import { storedList } from "util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function getBorrowerReportsAPI(payload) {
    return axios.post(BASE_URL + `borrower-disbursement-reports/${payload.page}/${payload.limit}`, payload);
}

export function generateBorrowerReportsAPI(payload) {
    return axios.post(BASE_URL + "borrower-disbursement-report", payload);
}

export function downloadBorrowerReportsAPI(payload) {
    return axios.get(BASE_URL + `borrower-download-disbursement-report/${payload?.submitData.id}/${payload?.userData.user_id}`);
}

export function getP2pReportsAPI(payload) {
    return axios.post(BASE_URL + `p2p-reports/${payload.page}/${payload.limit}`, payload);
}

export function generateP2pReportsAPI(payload) {
    return axios.post(BASE_URL + "p2p-report", payload);
}

export function downloadP2pReportsAPI(payload) {
    return axios.get(BASE_URL + `p2p-download-report/${payload?.submitData.id}/${payload?.userData.user_id}`);
}


//this API is used to download UTR Reports
export function downloadUTRReportsAPI(payload) {
    const user = storedList("user") ? storedList("user") : { id: null };
    payload.user_id = user._id;
    return axios.get(BASE_URL + `download-processed-bank-files/${payload?.id}/${user._id}`);
}

export function getCoLenderRepaymentAPI(payload) {
    return axios.post(BASE_URL + `co-lender-repayment-report`, payload);
}

export function getCoLenderRepaymentSummaryAPI(payload){
    return axios.post(BASE_URL + `download-co-lender-repayment-summary`, payload,
    {
        responseType : "arraybuffer"
    }).then(res => {
        return res.data;
    }).catch(err => {
        return false;
    });
}
