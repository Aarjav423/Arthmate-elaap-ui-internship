
// to get all loc drawdown reports lists on reports page
export function getLocDrawdownReportsWatcher(data, resolve, reject) {
    return {
      type: "GET_LOC_DRAWDOWN_REPORTS",
      payload: data,
      resolve,
      reject
    };
  }

// to generate loc drawdown reports entry on reports page
  export function generateLocDrawdownReportsWatcher(data, resolve, reject) {
    return {
      type: "GENERATE_LOC_DRAWDOWN_REPORTS",
      payload: data,
      resolve,
      reject
    };
  }
  
  // to download loc drawdown report file when clicking on download icon
  export function downloadLocDrawdownReportWatcher(data, resolve, reject) {
    return {
      type: "DOWNLOAD_LOC_DRAWDOWN_REPORTS",
      payload: data,
      resolve,
      reject
    };
  }
