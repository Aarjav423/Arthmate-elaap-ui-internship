
// to get all screening reports lists on reports page
export function getScreenReportsWatcher(data, resolve, reject) {
    return {
      type: "GET_SCREEN_REPORTS",
      payload: data,
      resolve,
      reject
    };
  }
  
// to generate screening reports entry on reports page
  export function generateScreenReportsWatcher(data, resolve, reject) {
    return {
      type: "GENERATE_SCREEN_REPORT",
      payload: data,
      resolve,
      reject
    };
  }
  
  // to download screening zip file when clicking on download icon
  export function downloadScreenReportWatcher(data, resolve, reject) {
    return {
      type: "DOWNLOAD_SCREEN_REPORT",
      payload: data,
      resolve,
      reject
    };
  }
  