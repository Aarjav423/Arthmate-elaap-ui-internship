export function getRepaymentDueReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_REPAYMENT_DUE_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateRepaymentDueReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_REPAYMENT_DUE_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadRepaymentDueReportWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_REPAYMENT_DUE_REPORT",
    payload: data,
    resolve,
    reject
  };
}
