export function validationsListWatcher(data, resolve, reject) {
  return {
    type: "VALIDATIONS_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}
