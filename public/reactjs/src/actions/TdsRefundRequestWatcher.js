export function TdsRefundRequestWatcher(data, resolve, reject) {
  return {
    type: 'POST_TDS_REFUND_REQUESTS',
    payload: data,
    resolve,
    reject,
  };
}
