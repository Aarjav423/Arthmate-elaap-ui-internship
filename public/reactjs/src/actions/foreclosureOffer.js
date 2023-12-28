export function getForeclosureOfferByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'FORECLOSURE_REQUEST_GET_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}

export function addForeclosureOfferByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'FORECLOSURE_REQUEST_POST_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}

export function getForeClosureRequestDetailsByReqIdWatcher(data, resolve, reject) {
  return {
    type: 'GET_FORECLOSURE_REQUEST_DETAILS_BY_REQ_ID',
    payload: data,
    resolve,
    reject,
  };
}

export function updateForeClosureRequestSagaIdWatcher(data, resolve, reject) {
  return {
    type: 'UPDATE_FORECLOSURE_REQUEST_APPROVE_STATUS',
    payload: data,
    resolve,
    reject,
  };
}

export function getForeclosureOfferRequestByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'GET_FORECLOSURE_OFFER_REQUEST_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}

export function getForceCloseByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'FORCE_CLOSE_GET_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}

export function addForceCloseByLoanIdWatcher(data, resolve, reject) {
  return {
    type: 'FORCE_CLOSE_POST_WATCHER',
    payload: data,
    resolve,
    reject,
  };
}
