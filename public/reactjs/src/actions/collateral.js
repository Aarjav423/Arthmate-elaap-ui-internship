export function getCollateralListWatcher(data, resolve, reject) {
    return {
        type: "GET_COLLATERAL_LIST_WATCHER",
        payload: data,
        resolve,
        reject
    };
};

export function getCollateralByIdWatcher(data, resolve, reject) {
    return {
        type: "GET_COLLATERAL_BY_ID_WATCHER",
        payload: data,
        resolve,
        reject
    };
};

export function updateCollateralByIdWatcher(data, resolve, reject) {
    return {
        type: "UPDATE_COLLATERAL_BY_ID_WATCHER",
        payload: data,
        resolve,
        reject
    };
};

export function addCollateralByIdWatcher(data, resolve, reject) {
  return {
    type: "ADD_COLLATERAL_RECORD",
    payload: data,
    resolve,
    reject
  };
};
