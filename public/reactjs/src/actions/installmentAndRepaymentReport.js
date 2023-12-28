export function getInstallmentAndRepaymentReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_INSTALLMENT_AND_REPAYMENT_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function generateInstallmentAndRepaymentReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_INSTALLMENT_AND_REPAYMENT_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadInstallmentAndRepaymentReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_INSTALLMENT_AND_REPAYMENT_REPORT",
    payload: data,
    resolve,
    reject
  };
}
