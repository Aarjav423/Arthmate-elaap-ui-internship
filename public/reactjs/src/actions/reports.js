export function getReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function downloadeReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function getCoLenderReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_CO_LENDER_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateEscrowReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_CO_LENDER_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function downloadCoLenderReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_CO_LENDER_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function downloadCoLenderLoansReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_CO_LENDER_LOANS_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function getBorrowerReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_BORROWER_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateBorrowerReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_BORROWER_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function downloadBorrowerReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_BORROWER_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

//this wasther is used to download the UTR Reports
export function downloadUTRReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_UTR_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

//this watcher is used to download the ckyc Reports
export function downloadCkycReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_CKYC_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

//this watcher is used to download the ckyc Reports
export function generateRefundReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_REFUND_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getRefundWatcher(data, resolve, reject) {
  return {
    type: "GET_REFUND_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function downloadRefundReportWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_REFUND_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

//this watcher is used to generate download and list insurance details
export function generateInsuranceReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_INSURANCE_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getInsuranceWatcher(data, resolve, reject) {
  return {
    type: "GET_INSURANCE_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function downloadInsuranceReportWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_INSURANCE_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

// Watcher to generate CIBIL Report

export function getCibilWatcher(data, resolve, reject) {
  return {
    type: "GET_CIBIL_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function downloadCibilReportWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_CIBIL_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getZipFIlesWatcher(data, resolve, reject) {
  return {
    type: "GET_ZIP_FILES",
    payload: data,
    resolve,
    reject
  };
}

export function getZipFIleWatcher(data, resolve, reject) {
  return {
    type: "GET_ZIP_FILE",
    payload: data,
    resolve,
    reject
  };
}

export function getCoLenderRepaymentReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_CO_LENDER_REPAYMENT_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function getP2pReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_P2P_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateP2pReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_P2P_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function downloadP2pReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_P2P_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

//this watcher is used to generate download and list disbursement failure details
export function generateDisbursementFailureReportsWatcher(
  data,
  resolve,
  reject
) {
  return {
    type: "GENERATE_DISBURSEMENT_FAILURE_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getDisbursementFailureWatcher(data, resolve, reject) {
  return {
    type: "GET_DISBURSEMENT_FAILURE_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function downloadDisbursementFailureReportWatcher(
  data,
  resolve,
  reject
) {
  return {
    type: "DOWNLOAD_DISBURSEMENT_FAILURE_REPORT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
