export function productTypeListWatcher(data, resolve, reject) {
  return {
    type: "PRODUCT_TYPE_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function colendersListWatcher(data, resolve, reject) {
  return {
    type: "COLENDERS_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function createColenderWatcher(data, resolve, reject) {
  return {
    type: "CREATE_COLENDER_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getColenderWatcher(data, resolve, reject) {
  return {
    type: "GET_COLENDER_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function putColenderWatcher(data, resolve, reject) {
  return {
    type: "PUT_COLENDER_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function toggleStatusWatcher(data, resolve, reject) {
  return {
    type: "TOGGLE_STATUS",
    payload: data,
    resolve,
    reject,
  };
}

export function newColenderIdWatcher(data, resolve, reject) {
  return {
    type: "NEW_COLENDER_ID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getColenderRepaymentScheduleWatcher(data, resolve, reject) {
  return {
    type: "GET_COLENDER_REPAYMENT_SCHEDULE_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getColenderTransactionHistoryWatcher(data, resolve, reject) {
  return {
    type: "GET_COLENDER_TRANSACTION_HISTORY_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

//this watcher is used for  UTR upload
export function utrUploadWatcher(data, resolve, reject) {
  return {
    type: "UTR_UPLOAD_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}


//this watcher is used to get the exixting UTR files
export function getUTRfilesWatcher(data, resolve, reject) {
  return {
    type: "GET_UTR_FILES_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function updateStatusWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_STATUS_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function submitFileUploadApprovalWatcher(data, resolve, reject) {
  return {
    type: "POST_FILE_UPLOAD_APPROVAL",
    payload: data,
    resolve,
    reject,
  };
}

export function colenderRepaymentListWatcher(data, resolve, reject) {
  return {
    type: "COLENDER_REPAYMENT_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function colenderSummaryPopupWatcher(data, resolve, reject) {
  return {
    type: "COLENDER_SUMMARY_POPUP_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function colenderDisburseWatcher(data, resolve, reject) {
  return {
    type: "COLENDER_DISBURSE_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function colenderMarkAsPaidWatcher(data, resolve, reject) {
  return {
    type: "COLENDER_MARK_AS_PAID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function downloadAllDocumentWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_ALL_DOCUMENT",
    payload: data,
    resolve,
    reject
  };
}