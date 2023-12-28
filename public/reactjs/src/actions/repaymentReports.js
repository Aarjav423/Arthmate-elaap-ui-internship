export function getRepaymentReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_REPAYMENT_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateRepaymentReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_REPAYMENT_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadRepaymentReportWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_REPAYMENT_REPORT",
    payload: data,
    resolve,
    reject
  };
}
