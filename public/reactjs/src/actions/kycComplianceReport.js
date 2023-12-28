export function getKycComplianceReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_KYC_COMPLIANCE_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateKycComplianceReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_KYC_COMPLIANCE_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadKycComplianceReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_KYC_COMPLIANCE_REPORT",
    payload: data,
    resolve,
    reject
  };
}
