export function getCollectionListWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLL_CASES_LIST",
    payload,
    resolve,
    reject,
  };
}




export function getCollectionCaseByIdWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLL_CASE_BY_ID",
    payload,
    resolve,
    reject,
  };
}

export function assignCollectionCasesWatcher(payload, resolve, reject) {
  return {
    type: "ASSIGN_COLL_CASES",
    payload,
    resolve,
    reject,
  };
}

export function deAssignCollectionCasesWatcher(payload, resolve, reject) {
  return {
    type: "DE_ASSIGN_COLL_CASES",
    payload,
    resolve,
    reject,
  };
}


export function getCaseSourcingPartnerWatcher(data, resolve, reject) {
  return {
    type: "GET_CASE_SOURCING_PARTNER",
    data,
    resolve,
    reject,
  };
}

export function getCaseCollHistoryByIdWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLL_HISTORY_BY_ID",
    payload,
    resolve,
    reject,
  };
}

export function getCaseCollPaymentDataByIdWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLL_CASE_PAYMENT_BY_ID",
    payload,
    resolve,
    reject,
  };
}

export function getCollectionCaseAssignWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLLECTION_CASES_ASSIGN",
    payload,
    resolve,
    reject,
  };
}


export function getCollectionCaseLmsIdWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLLECTION_CASE_LMS_ID",
    payload,
    resolve,
    reject,
  };
}

export function getCollectionCaseCollIdsWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLLECTION_CASE_COLL_IDs",
    payload,
    resolve,
    reject,
  };
}

export function getCollectionCaseSelectedWatcher(payload, resolve, reject) {
  return {
    type: "GET_COLLECTION_CASE_SELECTED",
    payload,
    resolve,
    reject,
  };
}

export function viewLoanDocumentLogsWatcher(payload, resolve, reject) {
  return {
    type: "CASE_VIEW_LOAN_DOCUMENT_LOGS",
    payload,
    resolve,
    reject,
  };
}