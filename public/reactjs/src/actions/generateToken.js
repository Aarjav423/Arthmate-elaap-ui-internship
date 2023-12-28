export function getTokenWatcher(data, resolve, reject) {
    return {
      type: "GET_TOKEN_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  