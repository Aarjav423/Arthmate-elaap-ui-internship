export function getRefundDetailsWatcher(data, resolve, reject) {
  return {
    type: 'GET_REFUND_DETAILS',
    payload: data,
    resolve,
    reject,
  };
}

export function initiateRefundWatcher(data, resolve, reject) {
  return {
    type: 'INITIATE_REFUND',
    payload: data,
    resolve,
    reject,
  };
}

export function initiateExcessRefundWatcher(data, resolve, reject) {
  return {
    type: 'INITIATE_EXCESS_REFUND',
    payload: data,
    resolve,
    reject,
  };
}
