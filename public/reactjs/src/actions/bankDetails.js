export function accountHolderListWatcher(data, resolve, reject) {
  return {
    type: "ACCOUNT_HOLDER_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function addAccountHolderWatcher(data, resolve, reject) {
  return {
    type: "ADD_ACCOUNT_HOLDER_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function editAccountHolderWatcher(data, resolve, reject) {
  return {
    type: "EDIT_ACCOUNT_HOLDER_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}