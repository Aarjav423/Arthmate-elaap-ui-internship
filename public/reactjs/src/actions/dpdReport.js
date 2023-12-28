export function getDPDReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_DPD_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function generateDPDReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_DPD_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadDPDReportsWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_DPD_REPORT",
    payload: data,
    resolve,
    reject
  };
}
