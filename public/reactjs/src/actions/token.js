export function getAllTokenWatcher(resolve, reject) {
  return {
    type: "GET_TOKEN",
    resolve,
    reject
  };
}

export function getTokenByCompanyWatcher(data, resolve, reject) {
  return {
    type: "GET_TOKEN_BY_COMPANY",
    payload: data,
    resolve,
    reject
  };
}

export function updateTokenWatcher(data) {
  return {
    type: "UPDATE_TOKEN",
    payload: data
  };
}

export function updateTokenStatusWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_TOKEN_STATUS",
    payload: data,
    resolve,
    reject
  };
}

export function deleteTokenWatcher(data, resolve, reject) {
  return {
    type: "DELETE_TOKEN",
    payload: data,
    resolve,
    reject
  };
}
