import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getReporstsAPI(payload) {
  return axios.post(
    BASE_URL + `disbursement_reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateReporstsAPI(payload) {
  return axios.post(BASE_URL + "disbursement-report", payload);
}

export function downloadReporstsAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-disbursement-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

export function getReportsAPI(payload) {
  return axios.post(
    BASE_URL +
      `co-lender-disbursement-reports/${payload.page}/${payload.limit}`,
    payload
  );
}

export function generateReportsAPI(payload) {
  return axios.post(BASE_URL + "co-lender-escrow-disbursement-report", payload);
}

export function downloadReportsAPI(payload) {
  return axios.get(
    BASE_URL +
      `co-lender-download-disbursement-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

export function downloadColenderLoansReportsAPI(payload) {
  return axios.get(
    BASE_URL +
      `co-lender-loans-report/${payload?.submitData.co_lender_id}/${payload?.userData.user_id}`
  );
}

export function generateRefundReportAPI(payload) {
  return axios.post(BASE_URL + `generate-refund-transaction-report`, payload);
}

export function getRefundReportAPI(payload) {
  return axios.post(
    BASE_URL + `refund-transaction-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadRefundReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-refund-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

// For insurance generate, list and download API's
export function generateInsuranceReportAPI(payload) {
  return axios.post(
    BASE_URL + `generate-insurance-transaction-report`,
    payload
  );
}

export function getInsuranceReportAPI(payload) {
  return axios.post(
    BASE_URL + `insurance-transaction-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadInsuranceReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-insurance-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

// For CIBIL get and download API's

export function getCibilReportAPI(payload) {
  return axios.post(
    BASE_URL + `cibil-transaction-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadCibilReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-cibil-report/${payload?.submitData.id}/${payload?.userData.user_id}`,
      {
        responseType:"arraybuffer"
      }
  );
}

// For disbursement failure generate, list and download API's
export function generateDisbursementFailureReportAPI(payload) {
  return axios.post(
    BASE_URL + `generate-disbursement-inprogress-report`,
    payload
  );
}

export function getDisbursementFailureReportAPI(payload) {
  return axios.post(
    BASE_URL +
      `disbursement-inprogress-report/${payload.page}/${payload.limit}`,
    payload
  );
}

export function downloadDisbursementFailureReportAPI(payload) {
  return axios.get(
    BASE_URL +
      `download-disbursement-inprogress-report/${payload?.submitData.id}/${payload?.userData.user_id}`
  );
}

export function getZipFIlesAPI(payload) {
  return axios.post(BASE_URL + "cbi/data", payload);
}

export function getZipFIleAPI(payload) {
  return axios.post(BASE_URL + "cbi/data/download", payload, {
    responseType: "arraybuffer"
  });
}
