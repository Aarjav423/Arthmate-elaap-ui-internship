export function repaymentV2FormPostWatcher(data, resolve, reject) {
  return {
    type: "REPAYMENTV2_FORM_POST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
