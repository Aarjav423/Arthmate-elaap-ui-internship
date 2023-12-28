

export function createLoanIDWatcher(data, resolve, reject) {
    return {
      type: "CREATE_LOANID",
      payload: data,
      resolve,
      reject
    };
  }


export function updateLoanIDWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_LOANID",
    payload: data,
    resolve,
    reject
  };
}

export function getBookLoanDetailsWatcher(payload, resolve, reject) {
    return {
      type: "GET_BOOK_LOAN_DETAILS",
      payload,
      resolve,
      reject,
    };
}

export function getMsmeLoanDocumentsWatcher(payload, resolve, reject) {
  return {
    type: "FETCH_MSME_LOAN_DOCUMENT",
    payload,
    resolve,
    reject,
  };
}

export function getGstStatusIDWatcher(data, resolve, reject) {
  return {
    type: "GST_ID_STATUS",
    payload: data,
    resolve,
    reject
  };
}

export function postLoanDetailsWatcher(data, resolve, reject) {
  return {
    type: "POST_LOAN_DETAILS",
    payload: data,
    resolve,
    reject
  };
}