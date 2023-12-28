//action to create waiver request
export function createWaiverRequestWatcher(data, resolve, reject) {
  return {
    type: "CREATE_WAIVER_REQUEST",
    payload: data,
    resolve,
    reject
  };
}
//action to fetch waiver request
export function getWaiverRequestDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_WAIVER_REQUEST_DETAILS",
    payload: data,
    resolve,
    reject
  };
}
export function getWaiverRequestDetailsByLoanWatcher(data, resolve, reject) {
  return {
    type: "GET_WAIVER_REQUEST_BY_LOAN_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getWaiverRequestDetailsByReqIdWatcher(data, resolve, reject) {
  return {
    type: "GET_WAIVER_REQUEST_DETAILS_BY_REQ_ID",
    payload: data,
    resolve,
    reject
  };
}

export function updateWaiverWaiverRequestStatusWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_WAIVER_REQUEST_STATUS",
    payload: data,
    resolve,
    reject
  };
}
