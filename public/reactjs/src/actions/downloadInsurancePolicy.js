export function downloadInsurancePolicy(data, resolve, reject) {
  return {
    type: "DOWNLOAD_INSURANCE_POLICY",
    payload: data,
    resolve,
    reject
  };
}
