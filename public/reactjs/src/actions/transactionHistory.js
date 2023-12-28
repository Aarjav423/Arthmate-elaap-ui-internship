export function transactionHistoryListWatcher(data, resolve, reject) {
  return {
    type: "TRANSACTION_HISTORY_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function drawDownRequestListWatcher(data, resolve, reject) {
  return {
    type: "DRAWDOWN_REQUEST_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function drawDownRequestDetailsWatcher(data, resolve, reject) {
  return {
    type: "DRAWDOWN_REQUEST_DETAILS_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function rejectDrawDownRequestWatcher(data, resolve, reject) {
  return {
    type: "REJECT_DRAWDOWN_REQUEST",
    payload: data,
    resolve,
    reject,
  };
}
