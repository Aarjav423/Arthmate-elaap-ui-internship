export function addDisbursementConfigChannel(data, resolve, reject) {
  return {
    type: "ADD_DISBURSEMENT_CONFIG_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function addColenderDisbursementConfigChannel(data, resolve, reject) {
  return {
    type: "ADD_COLENDER_DISBURSEMENT_CONFIG_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function ListDisbursementConfigChannel(data, resolve, reject) {
  return {
    type: "GET_ALL_DISBURSEMENT_CONFIG_CHANNEL",
    payload: data,
    resolve,
    reject
  };
}

export function getDisbursementConfigChannelByCIDPID(data, resolve, reject) {
  return {
    type: "GET_DISBURSEMENT_CONFIG_CHANNEL_BY_CID_PID",
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

export function updateDisbursementConfigChannelStatus(data, resolve, reject) {
  return {
    type: "UPDATE_DISBURSEMENT_CONFIG_CHANNEL_STATUS",
    payload: data,
    resolve,
    reject
  };
}

export function deleteDisbursementConfigChannel(data, resolve, reject) {
  return {
    type: "DELETE_DISBURSEMENT_CONFIG_CHANNEL_BYID",
    payload: data,
    resolve,
    reject
  };
}
