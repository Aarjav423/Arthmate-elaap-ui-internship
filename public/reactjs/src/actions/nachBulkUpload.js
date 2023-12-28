export function getBulkUploadDataWatcher(data, resolve, reject) {
  return {
    type: "BULK_UPLOAD_DATA",
    payload: data,
    resolve,
    reject
  };
}

export function uploadBulkFileWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_BULK_FILE",
    payload: data,
    resolve,
    reject
  };
}

export function downloadBulkUploadFileWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_BULK_UPLOAD_FILE",
    payload: data,
    resolve,
    reject
  };
}