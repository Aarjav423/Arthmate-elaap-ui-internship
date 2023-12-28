export function batchTransactionDataWatcher(data, resolve, reject) {
  return {
    type: "BATCH_TRANSACTION_DATA",
    payload: data,
    resolve,
    reject
  };
}

export function uploadPresentmentFileWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_PRESENTMENT_FILE",
    payload: data,
    resolve,
    reject
  };
}

export function downloadPresentmentFileWatcher(data, resolve, reject) {
  console.log(data);
  return {
    type: "DOWNLOAD_PRESENTMENT_FILE",
    payload: data,
    resolve,
    reject
  };
}