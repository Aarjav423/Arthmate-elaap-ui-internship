
// to get all loc drawdown reports lists on reports page
export function getReportRequestsWatcher(data, resolve, reject) {
  return {
    type: "GET_REPORT_REQUESTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateReportRequestWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_REPORT_REQUEST",
    payload: data,
    resolve,
    reject
  };
}

export function downloadReportRequestFileWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_REPORT_REQUEST",
    payload: data,
    resolve,
    reject
  };
}
