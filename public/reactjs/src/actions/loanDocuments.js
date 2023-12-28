export function getLoanDocsWatcher(data, resolve, reject) {
  return {
    type: "GET_LOAN_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getProductDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_PRODUCT_DETAILS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}


export function getDocDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_DOC_DETAILS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
/**
  Method to get all the drawdown documents for a loanid
  * @param {*} data contains the payload for api
  * @returns {*} JSON object
*/
export function getDrawDownDocsWatcher(data, resolve, reject) {
  return {
    type: "GET_DRAWDOWN_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
export function uploadLoanDocumentsWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_LOAN_DOCUMENTS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function uploadLoanDocumentsXmlJsonWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_LOAN_DOCUMENTS_XML_JSON_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function viewDocsWatcher(data, resolve, reject) {
  return {
    type: "VIEW_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

/**
  Method to uplaod a drawdown document for a loanid
  * @param {*} data contains the payload for api
  * @returns {*} JSON object
*/
export function uploadDrawDownDocumentsWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_DRAWDOWN_DOCUMENTS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getLoanDocumentsWatcher(payload, resolve, reject) {
  return {
    type: "FETCH_LOAN_DOCUMENT",
    payload,
    resolve,
    reject,
  };
}
