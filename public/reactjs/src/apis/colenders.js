import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";
import { storedList } from "../util/localstorage";

/* Product Type API's */

export function productTypeListApi(payload) {
  return axios.get(BASE_URL + "product-type", payload);
}

export function colendersListApi(payload) {
  return axios.get(BASE_URL + "co-lender-profile", payload);
}

export function createColenderApi(payload) {
  return axios.post(BASE_URL + "co-lender-profile", payload);
}

export function getColenderApi(payload) {
  return axios.get(`${BASE_URL}co-lender-profile/${payload.id}`, payload);
}

export function putColenderApi(payload) {
  return axios.put(
    `${BASE_URL}co-lender-profile/${payload.co_lender_id}`,
    payload
  );
}

export function toggleStatusApi(payload) {
  return axios.put(
    `${BASE_URL}co-lender-status/${payload.co_lender_id}`,
    payload
  );
}

export function newColenderIdApi(payload) {
  return axios.get(`${BASE_URL}co-lender-profile-newcolenderid`, payload);
}

export function getColendersProduct(co_lender_id) {
  return axios.get(`${BASE_URL}co-lenders-product/${co_lender_id}`);
}

export function getColenderLoans(
  colenderID,
  companyId,
  productId,
  status,
  loanMinAmount,
  loanMaxAmount,
  fromDate,
  toDate,
  page_no,
  size
) {

  return axios.get(`${BASE_URL}co-lender-loan-search`, {
    params: {
      co_lender_id: colenderID ? colenderID : "",
      company_id: companyId ? companyId : "",
      product_id: productId ? productId : "",
      status: status ? status : "",
      min_colend_loan_amount: loanMinAmount ? loanMinAmount : "",
      max_colend_loan_amount: loanMaxAmount ? loanMaxAmount : "",
      from_created_at: fromDate ? fromDate : "",
      to_created_at: toDate ? toDate : "",
      page_no: page_no == 0 || 1 ? page_no + 1 : "",
      size: size ? size : ""
    },
  });
}

export function getColenderRepaymentScheduleApi(payload) {
  return axios.get(`${BASE_URL}co-lender-repayment-schedule/${payload.co_lend_loan_id}/${payload.co_lender_id}`);
}

export function getColenderTransactionHistoryApi(payload) {
  return axios.get(
    `${BASE_URL}co-lender-transaction-history/${payload.co_lend_loan_id}/${payload.co_lender_id}`
  );
}

//this api is used to upload UTR file
export function utrUploadApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "bank-file-details-dump", payload);
}

export function fileUploadApprovalApi(payload) {
  return axios.post(BASE_URL + "file-upload-approval-submit", payload);
}

//this api is used to get the existing UTR files
export function getUTRfiles(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.get(`${BASE_URL}bank-file-details/${payload.user_id}`, payload);
} 

export function getCbiLoans(
  colenderID,
  companyId,
  productId,
  fromDate,
  toDate,
  page_no,
  size,
  status,
  assignee
) {
  const user = storedList("user") ? storedList("user") : { id: null };
  return axios.get(`${BASE_URL}cbi-loan-search`, {
    params: {
      co_lender_id: colenderID ? colenderID : "",
      company_id: companyId ? companyId : "",
      product_id: productId ? productId : "",
      user_id: user._id,
      from_created_at: fromDate ? fromDate : "",
      to_created_at: toDate ? toDate : "",
      page_no: page_no == 0 || 1 ? page_no + 1 : "",
      size: size ? size : "",
      status: status ? status : "",
      assignee:assignee?assignee:null
    },
  });
}

export function getLoanDetails(loan_id){
  return axios.get(`${BASE_URL}fetch-loan-details`, {
    params: {
      loan_id: loan_id ? loan_id : "",
    },
  });
}

export function getLeadDetails(loan_app_id){
  return axios.get(`${BASE_URL}fetch-lead-details`, {
    params: {
      loan_app_id: loan_app_id ? loan_app_id : "",
    },
  });
}

export function getCkycDetails(loan_app_id){
  return axios.get(`${BASE_URL}fetch-ckyc-details`, {
    params: {
      loan_app_id: loan_app_id ? loan_app_id : "",
    },
  });
}

export function getBulkApprovalFiles(
  colenderShortCode,
  filetype_name,
  validation,
  fromDate,
  toDate,
) {

  return axios.get(`${BASE_URL}file-upload-approval-search`, {
    params: {
      co_lender_shortcode: colenderShortCode ? colenderShortCode : "",
      file_type: filetype_name ? filetype_name : 0,
      validation_status: validation ? validation : "",
      from_created_at: fromDate ? fromDate : "",
      to_created_at: toDate ? toDate : "",
    },
  });
}

export function getCbiLoansDetails(
 loan_id
) {
  return axios.get(`${BASE_URL}fetch-cbi-loan`,{
    params: {
      loan_id: loan_id
    },
  });
}

export function updateStatusApi(payload) {
  return axios.post(
    `${BASE_URL}co-lender-loan-decision`,payload
  );
}

export function colenderRepaymentListApi(payload) {
  return axios.post(`${BASE_URL}co-lender-repayment-list`, payload);
}

export function colenderSummaryPopupApi(payload) {
  return axios.post(`${BASE_URL}co-lend-transaction/${payload.summary_id}`,payload);
}

export function colenderDisburseApi(payload) {
  return axios.patch(BASE_URL+"update-summary-stage",payload);
}

export function colenderMarkAsPaidApi(payload) {
  return axios.patch(`${BASE_URL}co-lend-repayment-utr`,payload);
}

export function downloadAllDocumentApi(payload){
  const { loan_id, user_id, company_id, product_id} = payload;
  return axios.get(BASE_URL + `download-all-document/${loan_id}/${user_id}/${company_id}/${product_id}`);
};