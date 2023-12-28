export function submitCamsDetailsWatcher(data, resolve, reject) {
  return {
    type: "CAMS_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getCamsDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_CAMS_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getBreDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_BRE_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function runCreditEngineWatcher(data, resolve, reject) {
  return {
    type: "RUN_CREDIT_ENGINE",
    payload: data,
    resolve,
    reject
  };
}

export function getSelectorDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_SELECTOR_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getSelectorDataByLoanAppIdWatcher(data, resolve, reject) {
  return {
    type: "SELECTOR_BY_ID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function submitSelectorDetailsWatcher(data, resolve, reject) {
  return {
    type: "POST_SELECTOR_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function submitSelectorColenderDetailsWatcher(data, resolve, reject) {
  return {
    type: "POST_SELECTOR_COLENDER_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function updateCamsDetailsWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_CAMS_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getUdhyamRegistrationDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_UDHYAM_REGISTRATION_DETAILS",
    payload: data,
    resolve,
    reject
  };
}



export function getCamsDataWatcher(data, resolve, reject) {
  return {
    type: "GET_CAMS_DATA",
    payload: data,
    resolve,
    reject
  };
}

export function updateCamsDataWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_CAMS_DATA",
    payload: data,
    resolve,
    reject
  };
}

export function getCamDetailsWatcher(data, resolve, reject) {
  return {
    type: 'GET_CAM_DETAILS',
    payload: data,
    resolve,
    reject,
  };
}