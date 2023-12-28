export function repaymentFormPostWatcher(data, resolve, reject) {
  return {
    type: "REPAYMENT_FORM_POST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}
