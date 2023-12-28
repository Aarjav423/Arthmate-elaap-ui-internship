export function getNachReportDataWatcher(data, resolve, reject) {
  return {
    type: "GET_NACH_REPORT_DATA",
    payload: data,
    resolve,
    reject
  };
}

export function downloadNachReportFileWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_NACH_REPORT_FILE",
    payload: data,
    resolve,
    reject
  };
}