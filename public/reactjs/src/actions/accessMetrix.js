export function getAccessMetrixWatcher(data, resolve, reject) {
  return {
    type: "GET_ACCESS_METRIX",
    data,
    resolve,
    reject
  };
}

export function addAccessMetrixWatcher(data, resolve, reject) {
  return {
    type: "ADD_ACCESS_METRIX",
    payload: data,
    resolve,
    reject
  };
}

export function updateAccessMetrixWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_ACCESS_METRIX",
    payload: data,
    resolve,
    reject
  };
}
