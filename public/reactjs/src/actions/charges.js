export function getChargeTypesWatcher(resolve, reject) {
  return {
    type: "GET_CHARGE_TYPES",
    resolve,
    reject
  };
}

export function applyChargeWatcher(data, resolve, reject) {
  return {
    type: "APPLY_CHARGE",
    payload: data,
    resolve,
    reject
  };
}
export function getChargesWatcher(data, resolve, reject) {
  return {
    type: "GET_CHARGE",
    payload: data,
    resolve,
    reject
  };
}
