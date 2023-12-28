export function setCreditLimitWatcher(data, resolve, reject) {
  return {
    type: "SET_CREDIT_LIMIT",
    payload: data,
    resolve,
    reject
  };
}
export function updateCreditLimitWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_CREDIT_LIMIT",
    payload: data,
    resolve,
    reject
  };
}
