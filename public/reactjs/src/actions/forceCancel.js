export function getForceCancelByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'FORCE_CANCEL_GET_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}

export function postForceCancelByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'FORCE_CANCEL_POST_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}