export function getLoanStateByLoanIdWatcher(data, resolve, reject) {
  return {
    type: "GET_LOAN_STATE_BY_LOAN_ID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
