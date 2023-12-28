export function getLeadDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_LEAD_DATA_EXPORT_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}
export function loanRequestFormPostWatcher(data, resolve, reject) {
  return {
    type: "LOAN_REQUEST_FORM_POST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function loanRequestFormPutWatcher(data, resolve, reject) {
  return {
    type: "LOAN_REQUEST_FORM_PUT_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getLoanRequestDataWatcher(data, resolve, reject) {
  console.log(data , "data in action")
  return {
    type: "GET_LOAN_REQUEST_DATA_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getLoanRequestByLoanIdWatcher(data, resolve, reject) {
  return {
    type: "GET_LOAN_REQUEST_BY_LOAN_ID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getActivityLogJSONWatcher(data, resolve, reject) {
  return {
    type: "GET_ACTIVITY_LOG_JSON_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getLeadDetailsByIdWatcher(data, resolve, reject) {
  return {
    type: "GET_LEAD_DETAILS_BYID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function updateLeadSectionWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_LEAD_SECTION_STATUS",
    payload: data,
    resolve,
    reject,
  };
}
export function downloadCibilReport(data, resolve, reject) {
  return {
    type: "DOWNLOAD_CIBIL_REPORT",
    payload: data,
    resolve,
    reject,
  };
}

export function getLeadDataByLoanAppIdWatcher(data, resolve, reject) {
  return {
    type: "GET_LEAD_DATA_BY_LOAN_APP_ID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}
export function deleteLeadWatcher(data, resolve, reject) {
  return {
    type: "DELETE_LEAD",
    payload: data,
    resolve,
    reject,
  };
}

export function settlementRequestWatcher(data, resolve, reject) {
  return {
    type: "SETTLEMENT_REQUEST_TRANCHES",
    payload: data,
    resolve,
    reject,
  };
}

export function settlementDecisionWatcher(data, resolve, reject) {
  return {
    type: "SETTLEMENT_DECISION",
    payload: data,
    resolve,
    reject,
  };
}

export function leadManualReviewWatcher(data, resolve, reject) {
  return {
    type: "LEAD_MANUAL_REVIEW",
    payload: data,
    resolve,
    reject,
  };
}

export function getLeadDataByLoanIdWatcher(data, resolve, reject) {
  return {
    type: "GET_LEAD_DATA_BY_LOAN_ID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function updateLeadDataByLoanIdWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_LEAD_DATA_BY_LOAN_ID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}