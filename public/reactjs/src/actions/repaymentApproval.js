export function getPendingRepaymentListWatcher(data, resolve, reject) {
  return {
    type: "GET_PENDING_REPAYMENT_LIST",
    payload: data,
    resolve,
    reject
  };
}
export function approveRepaymentsWatcher(data, resolve, reject) {
  return {
    type: "APPROVE_REPAYMENTS",
    payload: data,
    resolve,
    reject
  };
}
