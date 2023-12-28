export function getEmiDataWatcher(data, resolve, reject) {
  return {
    type: "GET_EMI_DATA",
    payload: data,
    resolve,
    reject
  };
}
export function submitForNachWatcher(data, resolve, reject) {
  return {
    type: "SUBMIT_FOR_NACH_PRESENTATION",
    payload: data,
    resolve,
    reject
  };
}

export function nachDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_NACH_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function nachHoldRegistrationWatcher(data, resolve, reject) {
  return {
    type: "NACH_HOLD_REGISTRATION",
    payload: data,
    resolve,
    reject
  };
}

export function nachRevokeRegistrationWatcher(data, resolve, reject) {
  return {
    type: "NACH_REVOKE_REGISTRATION",
    payload: data,
    resolve,
    reject
  };
}

export function createSubscriptionWatcher(data, resolve, reject) {
  return {
    type: "CREATE_SUBSCRIPTION",
    payload: data,
    resolve,
    reject
  };
}

export function getMandatePurposeWatcher(data, resolve, reject) {
  return {
    type: "GET_NACH_PURPOSE_DETAIL",
    payload: data,
    resolve,
    reject
  };
}

export function singleNachDetailWatcher(data, resolve, reject) {
  return {
    type: "GET_ROW_NACH_DETAIL",
    payload: data,
    resolve,
    reject
  };
}

export function enachTransactionHistotryWatcher(data, resolve, reject) {
  return {
    type: "GET_NACH_TRANSACTION_DETAIL",
    payload: data,
    resolve,
    reject
  };
}

export function enachCreatePresentmentWatcher(data, resolve, reject) {
  return {
    type: "POST_NACH_PRESENTMENT_DETAIL",
    payload: data,
    resolve,
    reject
  };
}
 
export function enachGenerateTokenWatcher(data, resolve, reject) {
  return {
    type: "GET_NACH_GENERATE_TOKEN",
    payload: data,
    resolve,
    reject
  };
}

export function cancelNachRegistrationWatcher(data, resolve, reject) {
  return {
    type: "CANCEL_NACH_REGISTRATION",
    payload: data,
    resolve,
    reject
  };
}

export function fetchNachLiveBankDetails(data, resolve, reject) {
  return {
    type: "GET_NACH_LIVE_BANK_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export function getLoanDetailsNachWatcher(data, resolve, reject) {
  return {
    type: "GET_LOAN_DETAILS_NACH",
    payload: data,
    resolve,
    reject
  };
}
