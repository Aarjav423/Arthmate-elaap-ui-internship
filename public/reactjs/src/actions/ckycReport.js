
// to get all ckyc reports lists on reports page
export function getCkycReportsWatcher(data, resolve, reject) {
    return {
      type: "GET_CKYC_REPORTS",
      payload: data,
      resolve,
      reject
    };
  }

// to generate ckyc reports entry on reports page
  export function generateCkycReportsWatcher(data, resolve, reject) {
    return {
      type: "GENERATE_CKYC_REPORT",
      payload: data,
      resolve,
      reject
    };
  }
  
  // to download ckyc zip file when clicking on download icon
  export function downloadCkycReportWatcher(data, resolve, reject) {
    return {
      type: "DOWNLOAD_CKYC_REPORT",
      payload: data,
      resolve,
      reject
    };
  }

  // to upload ckyc txt file
    export function CkycUploadReportWatcher(data, resolve, reject) {
      return {
        type: "CKYC_UPLOAD_WATCHER",
        payload: data,
        resolve,
        reject
      };
    }
  
      // to get ckyc txt file
      export function getCkycUploadReportWatcher(data, resolve, reject) {
        return {
          type: "GET_CKYC_UPLOADED_FILE",
          payload: data,
          resolve,
          reject
        };
      }

 // to download ckyc  txt file when clicking 
  export function downloadCkycFileReportWatcher(data, resolve, reject) {
    return {
      type: "DOWNLOAD_CKYC_TEXT_FILE",
      payload: data,
      resolve,
      reject
    };
  }