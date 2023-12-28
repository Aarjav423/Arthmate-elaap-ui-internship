export function getInsuranceBillingReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_INSURANCE_BILLING_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function generateInsuranceBillingReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_INSURANCE_BILLING_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadInsuranceBillingReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_INSURANCE_BILLING_REPORT",
    payload: data,
    resolve,
    reject
  };
}
