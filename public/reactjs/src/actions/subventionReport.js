export function getSubventionReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_SUBVENTION_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateSubventionReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_SUBVENTION_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadSubventionReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_SUBVENTION_REPORT",
    payload: data,
    resolve,
    reject
  };
}
