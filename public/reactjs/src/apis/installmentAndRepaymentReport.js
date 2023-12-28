import axios from "axios";
import {BASE_URL} from "../constants/apiUrls";

export function getInstallmentAndRepaymentReportsAPI(payload) {
  return axios.post(
    BASE_URL + `installment-repayment-recon-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateInstallmentAndRepaymentReportAPI(payload) {
  return axios.post(BASE_URL + "installment-repayment-recon-report", payload);
}

export function downloadInstallmentAndRepaymentReportAPI(payload) {
  return axios.post(
    BASE_URL + `download-installment-repayment-recon-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}
