export function getTdsRefundDataWatcher(data, resolve, reject) {
  return {
      type: "GET_TDS_REFUND_DATA",
      payload: data,
      resolve,
      reject
    };
  }

  export function updateTDSRefundStatusWatcher(data, resolve , reject) {
    return {
      type: "UPDATE_TDS_REFUND_STATUS",
      payload: data,
      resolve,
      reject
    };
  }

  export function getRefundDataDetailsWatcher(data, resolve, reject) {
    return {
        type: "GET_REFUND_LOANID_DETAILS",
        payload: data,
        resolve,
        reject
      };
    }