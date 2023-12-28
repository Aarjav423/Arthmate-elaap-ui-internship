export function getBorrowerDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_BORROWER_DETAILS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function addBorrowerInfoSinglefoWatcher(data, resolve, reject) {
  return {
    type: "ADD_BORROWER_INFO_SINGLE_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function loanDisbursementWatcher(data, resolve, reject) {
  return {
    type: "LOAN_DISBURSEMENT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getBorrowerDetailsByIdWatcher(data, resolve, reject) {
  return {
    type: "GET_BORROWER_DETAILS_BYID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getAcceptBorrowerDetailsByIdWatcher(data, resolve, reject) {
  return {
    type: "GET_ACCEPT_BORROWER_DETAILS_BYID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateBorrowerInfoCommonUncommonWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_BORROWERINFO_COMMON_UNCOMMON_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateBorrowerInfoWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_BORROWER_INFO_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateDaApprovalWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_DA_APPROVAL_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateBankDetailsWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_BANK_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function updateMiscDetailsWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_MISC_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function updateUMRNDetailsWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_UMRN_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getCustomerIdWatcher(data, resolve, reject) {
  return {
    type: "GET_CUSTOMER_ID",
    payload: data,
    resolve,
    reject
  };
}

export function updateMarkRepoWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_MARK_REPO",
    payload: data,
    resolve,
    reject
  };
}