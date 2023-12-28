export function getForeclosureRequest(data, resolve, reject) {
  return {
    type: "GET_FORECLOSURE_REQUEST",
    payload: data,
    resolve,
    reject
  };
}

export function getForeclosureOfferRequestWatcher(data, resolve, reject) {
  return {
    type: "GET_FORECLOSURE_OFFER_REQUEST",
    payload: data,
    resolve,
    reject
  };
}

export function getWaiverRequestWatcher(data, resolve, reject) {
  return {
    type: "GET_WAIVER_REQUEST",
    payload: data,
    resolve,
    reject
  };
}

export function getWaiverRequestLoanWatcher(data, resolve, reject) {
  return {
    type: "GET_WAIVER_REQUEST_LOAN",
    payload: data,
    resolve,
    reject
  };
}

export function putServiceRequestAction(data, resolve, reject) {
  return {
    type: "SERVICE_REQUEST_ACTION",
    payload: data,
    resolve,
    reject
  };
}
