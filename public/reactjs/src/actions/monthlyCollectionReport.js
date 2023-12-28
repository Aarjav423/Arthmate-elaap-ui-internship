export function getMonthlyCollectionReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_MONTHLY_COLLECTION_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadMonthlyCollectionReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_MONTHLY_COLLECTION_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function getServiceUsageReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_SERVICE_USAGE_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function downloadServiceUsageReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_SERVICE_USAGE_REPORT",
    payload: data,
    resolve,
    reject
  };
}
