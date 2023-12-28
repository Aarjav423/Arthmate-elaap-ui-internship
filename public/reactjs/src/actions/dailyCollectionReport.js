export function getDailyCollectionReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_DAILY_COLLECTION_REPORT",
    payload: data,
    resolve,
    reject,
  };
}

export function downloadDailyCollectionReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_DAILY_COLLECTION_REPORT",
    payload: data,
    resolve,
    reject,
  };
}

export function downloadDailyLeadReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_DAILY_LEAD_REPORT",
    payload: data,
    resolve,
    reject,
  };
}

export function downloadDailyLoanReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_DAILY_LOAN_REPORT",
    payload: data,
    resolve,
    reject,
  };
}

export function getDailyLeadReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_DAILY_LEAD_REPORT",
    payload: data,
    resolve,
    reject,
  };
}

export function getDailyLoanReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_DAILY_LOAN_REPORT",
    payload: data,
    resolve,
    reject,
  };
}
