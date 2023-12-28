export function getMsmeAgenciesWatcher(payload, resolve, reject) {
    return {
      type: "GET_MSME_AGENCIES_LIST",
      payload,
      resolve,
      reject,
    };
  }
  
