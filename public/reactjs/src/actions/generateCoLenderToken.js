
export function getCoLenderTokenWatcher(data, resolve, reject) {
    return {
      type: "GET_CO_LENDER_TOKEN_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
