export function addTopUpDisbursement(data, resolve, reject) {
  return {
    type: "ADD_TOPUP_DISBURSEMENT",
    payload: data,
    resolve,
    reject
  };
}

export function deleteDisbursementChannel(data, resolve, reject) {
  return {
    type: "DELETE_DISBURSEMENT_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function updateDisbursementChannel(data, resolve, reject) {
  return {
    type: "UPDATE_DISBURSEMENT_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function AddDisbursementChannel(data, resolve, reject) {
  return {
    type: "ONBOARD_DISBURSEMENT_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function getListDisbursementChannelWatcher(data, resolve, reject) {
  return {
    type: "GET_LIST_DISBURSEMENT_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function updateDisbursementConfigChannel(data, resolve, reject) {
  return {
    type: "UPDATE_DISBURSEMENT_CONFIG_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function compositeDisbursementWatcher(data, resolve, reject) {
  return {
    type: "COMPOSITE_DISBURSEMENT",
    payload: data,
    resolve,
    reject
  };
}

export function processDrawdownPfWatcher(data, resolve, reject) {
  return {
    type: "PROCESS_DRAWDOWN_PF",
    payload: data,
    resolve,
    reject
  };
}

export const getLoanByStatusWatcher = (data, resolve, reject) => {
  return {
    type: "GET_LOAN_BY_STATUS",
    payload: data,
    resolve,
    reject
  };
};
export const getLoanByStatusForLocWatcher = (data, resolve, reject) => {
  return {
    type: "GET_UNPROCESSED_REQUEST",
    payload: data,
    resolve,
    reject
  };
};
export const compositeDrawdownWatcher = (data, resolve, reject) => {
  return {
    type: "COMPOSITE_DRAWDOWN",
    payload: data,
    resolve,
    reject
  };
};

export const batchDisbursementWatcher = (data, resolve, reject) => {
  return {
    type: "BATCH_DISBURSEMENT",
    payload: data,
    resolve,
    reject
  };
};

export const fetchBankDetailsWatcher = (data, resolve, reject) => {
  return {
    type: "FETCH_BANK_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export const fetchSchemeDetailsWatcher = (data, resolve, reject) => {
  return {
    type: "FETCH_SCHEME_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

export const updateDrawdownRequestWatcher = (data, resolve, reject) => {
  return {
    type: "UPDATE_DRAWDOWN_REQUEST",
    payload: data,
    resolve,
    reject
  };
}

export const calculateNetDrawDownAmountWatcher = (data, resolve, reject) => {
  return {
    type: "CALCULATE_NET_DRAWDOWN_AMOUNT",
    payload: data,
    resolve,
    reject
  };
}
