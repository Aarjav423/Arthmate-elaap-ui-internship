import axios from "axios";
import { storedList } from "../util/localstorage";
import { BASE_URL } from "../constants/apiUrls";

export function loanRequestFormPostApi(payload) {
  const { options, postData } = payload;
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  return axios.post(
    `${BASE_URL}loan_request_form/${options.company_id}/${options.company_code}/${options.product_id}/${options.loan_schema_id}/${user._id}`,
    postData
  );
}

export function loanRequestFormPutApi(payload) {
  const user = storedList("user")
    ? storedList("user")
    : {
        _id: null
      };
  payload.options.user_id = user._id;
  return axios.put(`${BASE_URL}lead`, payload);
}

export function getLoanRequestDataApi(payload) {
  const user = storedList("user");
  return axios.get(
    `${BASE_URL}loanrequest/${payload.partner_id}/${payload.product_id}/${
      payload.from_date
    }/${payload.to_date}/${payload.page}/${payload.limit}/${
      payload.str || null
    }/${payload.status || null}/${user._id || null}`,
    {
      params:{is_msme:payload.is_msme}
    }
  );
}

export function loanRequestByLoanIdApi(payload) {
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  payload.user_id = user._id;
  return axios.post(`${BASE_URL}loanrequest/${payload.loan_id}`, payload);
}

export function getActivityLogApi(payload) {
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  payload.user_id = user._id;
  return axios.post(
    `${BASE_URL}lead/activity-log/${payload?.loan_app_id}`,
    payload
  );
}

export function getLeadDetailByIdApi(payload) {
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  payload.user_id = user._id;
  const { company_id, product_id, user_id, loan_app_id, loan_schema_id } =
    payload;
  return axios.get(
    `${BASE_URL}${"lead/details"}/${loan_app_id}/${company_id}/${product_id}/${user_id}/${loan_schema_id}`
  );
}

export function updateLeadSectionApi(payload){
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  payload.user = user;
  payload.user_id = user._id;
  const { company_id, product_id, user_id, loan_app_id, loan_schema_id } =
    payload;
  return axios.post(`${BASE_URL}msme/lead/${payload.loan_app_id}/update-section`, payload);
}

export function downloadCibilReportApi(payload) {
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  payload.user_id = user._id;
  const { company_id, product_id, user_id, loan_app_id, borrower_type } =
    payload;
  return axios.get(
    `${BASE_URL}${"lead-cibil-report"}/${loan_app_id}/${company_id}/${product_id}/${user_id}/${borrower_type}`
  );
}

export function getLeadDataByLoanAppIdApi(payload) {
  const user = storedList("user")
    ? storedList("user")
    : {
        id: null
      };
  payload.user_id = user._id;
  return axios.post(`${BASE_URL}lead/${payload.loan_app_id}`, payload);
}

export function deleteLeadApi(payload) {
  const user = storedList("user");
  payload.user_id = user._id;
  return axios.put(
    `${BASE_URL}lead-soft-delete/${payload.loan_app_id}`,
    payload
  );
}

export function leadManualReviewApi(payload) {
  return axios.put(`${BASE_URL}lead-status-decission`, payload);
}

export function settlementRequestApi(payload) {
  return axios.post(
    `${BASE_URL}settlement-request/${payload.loan_id}`,
    payload
  );
}

export function settlementDecisionApi(payload) {
  return axios.patch(
    `${BASE_URL}settlement-request/${payload.loan_id}/${payload.request_id}`,
    payload
  );
}

export function getLeadDetailApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.post(BASE_URL + "lead-export", payload);
}

export function getLeadDataByLoanIdApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.get(
    BASE_URL +
      `kyc-document-data/${payload.company_id}/${payload.product_id}/${user._id}/${payload.loan_id}`
  );
}

export function updateLeadDataByLoanIdApi(payload) {
  const user = storedList("user") ? storedList("user") : { id: null };
  payload.user_id = user._id;
  return axios.put(
    BASE_URL +
      `kyc-document-data/${payload.company_id}/${payload.product_id}/${user._id}/${payload.loan_id}`,
    payload
  );
}
