export function transactionDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_TRANSACTION_DETAIL",
    payload: data,
    resolve,
    reject,
  };
}
export function enachDetailsTransactionWatcher(data, resolve, reject) {
  return {
    type: "GET_ENACH_DETAILS_NACH_TRANSACTION",
    payload: data,
    resolve,
    reject
  };
}