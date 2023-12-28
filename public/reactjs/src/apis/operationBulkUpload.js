import axios from "axios"
import { BASE_URL } from "../constants/apiUrls";

export function postOperationFileDetails(req) {
    return axios.post(`${BASE_URL}repayment-file`,req)
}

export function getBulkFileDetails(req) {
    return axios.post(`${BASE_URL}repayment-file/${req.page}/${req.limit}`,req)
}

export async function downloadRepaymentFile(payload){
    try {
        const res = await axios.post(`${BASE_URL}repayment-file/${payload.id}`, payload,
            {
                responseType: "arraybuffer"
            })
        return res.data;
    } catch (err) {
        return false;
    }
}